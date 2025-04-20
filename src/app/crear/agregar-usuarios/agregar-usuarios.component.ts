import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ServiciosService } from '../../services/services.service';

@Component({
  selector: 'app-agregar-usuarios',
  templateUrl: './agregar-usuarios.component.html',
  styleUrl: './agregar-usuarios.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ]  
})
export class AgregarUsuariosComponent implements OnInit {
  @Input() id!: number;
  readonly serviciosService = inject(ServiciosService);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);

  userForm: FormGroup;
  mensajeError: string = '';

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      area: ['', [Validators.required]],
      ip_address: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]]
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.serviciosService.mostrarUsuario(this.id).subscribe({
        next: (response: any) => {
          console.log('mostrarUsuario', response);
          this.userForm.patchValue({
            name: response.data.name,
            area: response.data.area,
            ip_address: response.data.ip_address
          });
        },
        error: (response: any) => {
          console.log('error', response);
          this.mensajeError = 'Ocurrió un error en el servidor';
        }
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const datos = this.userForm.value;
      
      if (this.id) {
        this.serviciosService.editar(this.id, datos).subscribe({
          next: (response: any) => {
            console.log('editar', response);
            alert('Se guardaron los datos correctamente');
            this.router.navigate(['/listado']);
          },
          error: (response: any) => {
            console.log('error', response);
            this.mensajeError = 'Ocurrió un error en el servidor';
          }
        });
      } else {
        this.serviciosService.enviar(datos).subscribe({
          next: (response: any) => {
            console.log('next', response);
            alert('Se agregó usuario correctamente');
            if (confirm('¿Quieres agregar un nuevo usuario?')) {
              this.userForm.reset();
            } else {
              this.router.navigate(['/listado']);
            }
          },
          error: (response: any) => {
            console.log('error', response);
            this.mensajeError = 'Ocurrió un error en el servidor';
          }
        });
      }
    }
  }

  eliminarIP() {
    if (this.id) {
      if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        this.serviciosService.eliminar(this.id).subscribe({
          next: (response: any) => {
            alert('Usuario Eliminado');
            console.log('eliminar', response);
            this.router.navigate(['/listado']);
          },
          error: (response: any) => {
            console.log('error', response);
            this.mensajeError = 'Ocurrió un error en el servidor';
          }
        });
      }
    }
  }
}
