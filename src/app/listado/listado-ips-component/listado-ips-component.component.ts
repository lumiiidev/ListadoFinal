import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServiciosService } from '../../services/services.service';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-listado-ips',
  templateUrl: './listado-ips-component.component.html',
  styleUrls: ['./listado-ips-component.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class ListadoIpsComponent implements OnInit {
  readonly servicio = inject(ServiciosService);
  
  usuarios: any[] = [];
  filteredUsers: any[] = [];
  mensajeError: string = '';
  searchControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  displayedColumns: string[] = ['name', 'area', 'ip_address', 'eliminar', 'editar'];

  ngOnInit(): void {
    this.obtenerUsuarios();
    
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.searchControl.valueChanges.subscribe(value => {
      this.filterUsers(value || '');
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usuarios
      .map(user => [user.name, user.ip_address])
      .flat()
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterUsers(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredUsers = this.usuarios.filter(user =>
      user.name.toLowerCase().includes(filterValue) ||
      user.ip_address.toLowerCase().includes(filterValue)
    );
  }

  obtenerUsuarios() {
    this.servicio.obtenerUsuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.data;
        this.filteredUsers = this.usuarios;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  eliminarIP(id: number) {
    if (id != 0 && id != null && id != undefined) {
      if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        this.servicio.eliminar(id).subscribe({
          next: (response: any) => {
            alert('Usuario Eliminado');
            console.log('eliminar', response);
            this.obtenerUsuarios();
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