import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  opened = true;
  _opened = true;
  readonly router = inject(Router); 
   constructor(
      private authService: AuthService
    ) {}  
    cerrarSesion(){
      this.authService.removeToken();
      console.log(this.authService.removeToken())
      alert('Has Cerrado Sesión Correctamente!');
      this.router.navigate(['/login']);
    }
    toggleSidenav() {
      this._opened = !this._opened;
    }
}
