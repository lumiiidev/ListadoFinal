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
      if (this.id) {
        this.editUser();
      } else {
        this.createUser();
      }
    }
  }


  createUser() {
    const datos = this.userForm.value;
  
    this.serviciosService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        const usuarios = response.data || response;
  
        const isDuplicate = usuarios.some((user: any) =>
          user.name.trim().toLowerCase() === datos.name.trim().toLowerCase() ||
          user.ip_address === datos.ip_address
        );
  
        if (isDuplicate) {
          this.mensajeError = 'Ya existe un usuario con ese nombre o dirección IP.';
          return;
        }
  
        this.serviciosService.enviar(datos).subscribe({
          next: () => {
            alert('Se agregó usuario correctamente');
            if (confirm('¿Quieres agregar un nuevo usuario?')) {
              this.userForm.reset();
            } else {
              this.router.navigate(['/listado']);
            }
          },
          error: () => this.mensajeError = 'Ocurrió un error en el servidor'
        });
      },
      error: () => this.mensajeError = 'No se pudo verificar duplicados'
    });
  }


  editUser() {
  const datos = this.userForm.value;

  this.serviciosService.obtenerUsuarios().subscribe({
    next: (response: any) => {
      const usuarios = response.data || response;

      const isIPDuplicate = usuarios.some((user: any) =>
        user.id !== this.id && user.ip_address === datos.ip_address
      );

      if (isIPDuplicate) {
        this.mensajeError = 'Ya existe un usuario con esa dirección IP.';
        return;
      }

      this.serviciosService.editar(this.id, datos).subscribe({
        next: () => {
          alert('Se actualizaron los datos correctamente');
          this.router.navigate(['/listado']);
        },
        error: () => this.mensajeError = 'Ocurrió un error al editar el usuario'
      });
    },
    error: () => this.mensajeError = 'No se pudo verificar duplicados'
  });
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
