import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service.service';


@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly router = inject(Router);
  userName: string = ''; 

  constructor(
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.userName = this.authService.getUserName(); 
  }

  getToken(){
    console.log(this.authService.getToken())
  }
  cerrarSesion(){
    this.authService.removeToken();
    console.log(this.authService.removeToken())
    alert('Has Cerrado Sesión Correctamente!');
    this.router.navigate(['/login']);
  }

}
