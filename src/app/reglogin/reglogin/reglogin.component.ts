import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reglogin.component.html',
  styleUrls: ['./reglogin.component.css'],
})
export class regLoginComponent {
  readonly router = inject(Router);
  user: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  });

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.user.valid) {
      const credentials = this.user.value;
      this.authService.register(credentials).subscribe({
        next: (response) => {
          console.log('Usuario creado exitosamente:', response);
          alert('Tu usuario ha sido registrado correctamente!');
          this.router.navigate(['/login']);
        },
      });
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}