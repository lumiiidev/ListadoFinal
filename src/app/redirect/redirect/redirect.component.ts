import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';


@Component({
  selector: 'app-redirect',
  standalone: true,
  template: ''
})
export class RedirectComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    const token = this.authService.getToken();
    console.log('RedirectComponent token:', token); 
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}