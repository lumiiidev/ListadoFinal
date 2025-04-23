import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServiciosService } from '../../services/services.service';
import { Router, RouterModule } from '@angular/router';


import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { DialogService } from '../../shared/dialog.service';
 
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
    ReactiveFormsModule,
    MatPaginator
  ]
})
export class ListadoIpsComponent implements OnInit {
  readonly servicio = inject(ServiciosService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  datasource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  usuarios: any[] = [];
  filteredUsers: any[] = [];
  mensajeError: string = '';
  searchControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;  
  displayedColumns: string[] = ['name', 'area', 'ip_address', 'eliminar', 'editar'];

  constructor(public sharedDialog: DialogService){ }
  

  ngOnInit(): void {
    this.obtenerUsuarios();
    
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.searchControl.valueChanges.subscribe(value => {
      this.filterUsers(value || '');
      this.datasource.filter= value || '';
    });

    


  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usuarios
      .map(user => [user.name, user.area, user.ip_address])
      .flat()
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterUsers(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredUsers = this.usuarios.filter(user =>
      user.name.toLowerCase().includes(filterValue) ||
      user.area.toLowerCase().includes(filterValue) ||
      user.ip_address.toLowerCase().includes(filterValue)
    );
  }

  obtenerUsuarios() {
    this.servicio.obtenerUsuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.data;
        this.filteredUsers = this.usuarios;
        this.datasource = new MatTableDataSource<any>(response.data)
        this.datasource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  eliminarIP(id: number): void {
    if (id != 0 && id != null && id != undefined) {
      this.sharedDialog.confirm('¿Estás seguro de que deseas eliminar este usuario?')
        .then((confirmed) => {
          if (confirmed) {
            this.servicio.eliminar(id).subscribe({
              next: (response: any) => {
                this.sharedDialog.showAlert('El usuario ha sido eliminado');
                console.log('eliminar', response);
                this.obtenerUsuarios();
              },
              error: (response: any) => {
                console.log('error', response);
                this.mensajeError = 'Ocurrió un error en el servidor';
              }
            });
          } else {
            console.log('Eliminación cancelada por el usuario');
          }
        });
    }
  }
  
}