import { Component, inject, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { AuthService } from '../../auth/auth-service.service';
import { ServiciosService } from '../../services/services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { DialogService } from '../../shared/dialog.service';
import { take } from 'rxjs';
import { IpDialogComponentForTheRegistrationFormComponent } from '../../dialogShowIpRegistrationForm/ip-dialog-for-the-registration-form/ip-dialog-for-the-registration-form.component';

@Component({
  selector: 'app-ip-dialog',
  imports: [MatDialogModule, MatListModule, MatButtonModule, NgFor, CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule],
  templateUrl: './ip-dialog.component.html',
  styleUrl: './ip-dialog.component.css'
})
export class IpDialogComponent {
  @Input() id!: number;
  showForm: boolean = false;
  readonly serviciosService = inject(ServiciosService);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);

  userForm!: FormGroup;
  mensajeError: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { segment: string, ips: string[] },
    private dialogRef: MatDialogRef<IpDialogComponent>,
    public dataService: AuthService,
    public sharedDialog: DialogService,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      area: ['', [Validators.required]],
      ip_address: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]]
    });

  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.id) {
        this.createUser();
      } else {console.log('Form is valid:', this.userForm.value);}
    }
  }



  selectIp(ip: string): void {
    console.log('Selected IP:', ip); // this returns the selected IP
  
    this.sharedDialog.confirm("¿Quieres agregar este usuario?")
      .then(confirmed => {
        if (confirmed) {
          this.showForm = true;
          this.dataService.valueSource.next(ip); // Emit the selected IP to the BehaviorSubject
          const new_ip_address = this.dataService.valueSource.getValue(); // Get the current value from the BehaviorSubject
          this.userForm.patchValue({ ip_address: ip }); // Set the selected IP in the form
          console.log('New IP Address to assign:', new_ip_address);
          console.log('valor de showForm: ' + this.showForm);
        }
      });
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
            this.sharedDialog.showAlert('Se agregó usuario correctamente').subscribe(() => {
              // When user closes the alert, then ask for confirmation to add a new one
              this.sharedDialog.confirm('¿Quieres agregar un nuevo usuario?').then(confirmNewUser => {
                if (confirmNewUser) {
                  this.userForm.reset();
                } else {
                  this.dialogRef.close();
                  this.router.navigate(['/ipcheck']);
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


closeDialog() {
  this.dialogRef.close(); // Forcefully close the dialog
  console.log("Dialog closed manually"); // Just to verify it's being triggered
}


}