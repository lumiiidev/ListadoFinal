import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class LoginComponent {
  readonly formBuilder = inject(FormBuilder);
  readonly router = inject(Router);
  
  hidePassword = true;
  errorMessage: string = '';
  isTyping: boolean = false;
  loading: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required]
  });

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.loading = true;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.authService.saveToken(response.authorization.token);
          alert('Bienvenido Admin!');
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
          this.loading = false;
        }
      });
    }
  }

  registrar() {
    this.router.navigate(['/registrar']);
  }

  onTyping() {
    this.isTyping = this.loginForm.controls['email'].value.trim().length != 0;
  }
}