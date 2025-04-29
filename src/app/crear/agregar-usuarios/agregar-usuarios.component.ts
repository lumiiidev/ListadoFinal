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
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { IpDialogComponentForTheRegistrationFormComponent } from '../../dialogShowIpRegistrationForm/ip-dialog-for-the-registration-form/ip-dialog-for-the-registration-form.component';
import { DialogService } from '../../shared/dialog.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';


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
    MatSelectModule,
    MatAutocompleteModule
  ]  
})
export class AgregarUsuariosComponent implements OnInit {
  @Input() id!: number;
  readonly serviciosService = inject(ServiciosService);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);

  userForm: FormGroup;
  mensajeError: string = '';

  ipList: string[] = [];
  filteredIps: string[] = [];

  constructor(private dialog: MatDialog, private sharedDialog: DialogService) {
    
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      area: ['', [Validators.required]],
      ip_address: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]],
      mac_address: ['', [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})$/)]]
    });
    
  }

  ngOnInit(): void {
    // 1. Load the current user for editing, if there's an ID
    if (this.id) {
      this.serviciosService.mostrarUsuario(this.id).subscribe({
        next: (response: any) => {
          console.log('mostrarUsuario', response);
          this.userForm.patchValue({
            name: response.data.name,
            area: response.data.area,
            ip_address: response.data.ip_address,
            mac_address: response.data.mac_address 
          });
        },
        error: (response: any) => {
          console.log('error', response);
          this.mensajeError = 'Ocurrió un error en el servidor';
        }
      });
    }
  
    // 2. Get all users to calculate available IPs
    this.serviciosService.obtenerUsuarios().subscribe(response => {
      const users = response.data;
      this.ipList = this.calculateAvailableIps(users);
      this.filteredIps = [...this.ipList];
    });

    
  
    // 3. Setup live filtering as the user types in the IP field
    this.userForm.get('ip_address')?.valueChanges.subscribe(value => {
      this.filterIps(value || '');
    });
    
  }
  
  //filterIps(search: string = '') {
    //const term = search.toLowerCase();
    //this.filteredIps = this.ipList.filter(ip => ip.includes(term));
  //}
  filterIps(query: string) {
    const lowered = query.trim().toLowerCase();
    this.filteredIps = this.ipList.filter(ip => ip.includes(lowered));
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


  createUser(): void {
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
            this.sharedDialog.showAlert('Se agregó usuario correctamente').subscribe(() => {
              // When user closes the alert, then ask for confirmation to add a new one
              this.sharedDialog.confirm('¿Quieres agregar un nuevo usuario?').then(confirmNewUser => {
                if (confirmNewUser) {
                  this.userForm.reset();
                } else {
                  this.router.navigate(['/listado']);
                }
              });
            });
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
          Number(user.id) !== Number(this.id) && user.ip_address === datos.ip_address
        );
  
        if (isIPDuplicate) {
          this.mensajeError = 'Ya existe un usuario con esa dirección IP.';
          return;
        }
  
        this.serviciosService.editar(this.id, datos).subscribe({
          next: () => {
            this.sharedDialog.showAlert('Se actualizaron los datos correctamente');
            this.router.navigate(['/listado']);
          },
          error: () => this.mensajeError = 'Ocurrió un error al editar el usuario'
        });
      },
      error: () => this.mensajeError = 'No se pudo verificar duplicados'
    });
  }
  
  
  
 

eliminarIP(): void {
  if (this.id) {
    this.sharedDialog.confirm('¿Estás seguro de que deseas eliminar este usuario?')
      .then(confirmed => {
        if (confirmed) {
          this.serviciosService.eliminar(this.id).subscribe({
            next: (response: any) => {
              this.sharedDialog.showAlert('Usuario Eliminado');
              console.log('eliminar', response);
              this.router.navigate(['/listado']);
            },
            error: (response: any) => {
              console.log('error', response);
              this.mensajeError = 'Ocurrió un error en el servidor';
            }
          });
        }
      });
  }
}


  openIpSelector() {
    this.serviciosService.obtenerUsuarios().subscribe(response => {
      const users = response.data;
      const availableIps = this.calculateAvailableIps(users);
  
      this.dialog.open(IpDialogComponentForTheRegistrationFormComponent, {
        width: '400px',
        data: {
          segment: 'Todos los segmentos',
          ips: availableIps
        }
      }).afterClosed().pipe(take(1)).subscribe(selectedIp => {
        if (selectedIp) {
          console.log('Selected IP:', selectedIp);
          this.userForm.get('ip_address')?.setValue(''); // Clear the field first
          this.userForm.get('ip_address')?.setValue(selectedIp); // Then set the new value
        }
      });
    });
  }
  

  calculateAvailableIps(users: any[]): string[] {
    const segments = [
      '172.16.51.0/24', '172.16.52.0/24', '172.16.53.0/24',
      '172.16.54.0/24', '172.16.55.0/24', '172.16.56.0/24'
    ];
  
    let allAvailableIps: string[] = [];
  
    segments.forEach(segment => {
      const base = segment.split('/')[0];
      const [a, b, c] = base.split('.').map(Number);
      const usedIps = users
        .map(u => u.ip_address)
        .filter(ip => ip.startsWith(`${a}.${b}.${c}.`));
      const allIps = Array.from({ length: 254 }, (_, i) => `${a}.${b}.${c}.${i + 1}`);
      const availableIps = allIps.filter(ip => !usedIps.includes(ip));
      
      allAvailableIps = [...allAvailableIps, ...availableIps];
    });
  
    return allAvailableIps;
  }

  onMacInput(event: any): void {
    let value = event.target.value.replace(/[^a-fA-F0-9]/g, ''); // strip non-hex chars
    value = value.substring(0, 12); // 💥 cap at 12 hex characters
    value = value.toUpperCase();
  
    let formatted = '';
  
    for (let i = 0; i < value.length; i++) {
      formatted += value[i];
      if ((i % 2 === 1) && i < 11) {
        formatted += '-';
      }
    }
  
    event.target.value = formatted;
    this.userForm.get('macAddress')?.setValue(formatted, { emitEvent: false });
  }
  
  
  
  

}
