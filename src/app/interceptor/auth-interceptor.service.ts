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

    // Estos endpoints no necesitan un token o lógica de actualización
  const excludedUrls = ['/login', '/register'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  
  // Si el token no es nulo y la URL no está en la lista de exclusión, se agrega el token a la solicitud
  const authReq = token && !isExcluded
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        // Intentar refrescar el token
        return authService.refreshToken().pipe(
          switchMap((refreshResponse: any) => {
            const newToken = refreshResponse.authorization?.token;

            if (newToken) {
              authService.saveToken(newToken);
              
              // Intentar la solicitud original con el nuevo token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });

              return next(retryReq);
            } else {              
              // Si no se obtiene un nuevo token, se maneja el cierre de sesión
              handleLogout(authService, router);
              return throwError(() => error);
            }
          }),
          catchError(refreshError => {            
            // Si la actualización falla, se maneja el cierre de sesión
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
