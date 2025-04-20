import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // These endpoints don't need a token or refresh logic
  const excludedUrls = ['/login', '/register'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  // Attach token if present and not excluded
  const authReq = token && !isExcluded
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        // Try to refresh the token
        return authService.refreshToken().pipe(
          switchMap((refreshResponse: any) => {
            const newToken = refreshResponse.authorization?.token;

            if (newToken) {
              authService.saveToken(newToken);

              // Retry the original request with the new token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });

              return next(retryReq);
            } else {
              // Refresh failed: logout
              handleLogout(authService, router);
              return throwError(() => error);
            }
          }),
          catchError(refreshError => {
            // Refresh itself failed: logout
            handleLogout(authService, router);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

function handleLogout(authService: AuthService, router: Router): void {
  authService.removeToken();
  router.navigate(['/login']);
}
