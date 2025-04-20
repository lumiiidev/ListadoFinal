import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { response } from 'express';
import { AuthService } from '../../auth/auth-service.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-regadmin',
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon],
  templateUrl: './regadmin.component.html',
  styleUrl: './regadmin.component.css'
})
export class RegadminComponent {
  readonly router = inject(Router);
  isTyping: boolean = false;
  showPassword: boolean = false;
  hidePassword = true;
  user: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),  
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
  });


  constructor(private authService: AuthService) { }
    
  onSubmit(): void {
    if(this.user.valid){
    const credentials = this.user.value;
    this.authService.register(credentials).subscribe({
      next: (response)=>{
        console.log('usuario creado exitosamente:',response);
        alert("Tu usuario ha sido registrado correctamente!");
        this.router.navigate(['/dashboard']);
        console.log(this.user.value); 

      }
    });    
  }
}

onTyping() {  
  this.isTyping = this.user.controls['name'].value.trim().length != 0;
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

}