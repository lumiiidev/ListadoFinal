import { Component, inject, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    public dataService: AuthService  
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



  selectIp(ip: string) {
    //this.dialogRef.close(ip);
    console.log('Selected IP:', ip);// this returns the selected IP 
    const confirmation = confirm("do you want to use this ip to register a user?"); // Emit the selected IP to the BehaviorSubject

    if(confirmation){
    this.showForm = true;  
    this.dataService.valueSource.next(ip); // Emit the selected IP to the BehaviorSubject
    const new_ip_address = this.dataService.valueSource.getValue(); // Get the current value from the BehaviorSubject
    this.userForm.patchValue({ ip_address: ip }); // Set the selected IP in the form
    console.log('New IP Address to assign:', new_ip_address); // Log the new IP address
    console.log('valor de showForm: ' + this.showForm); // Log the value of showForm
  }
}


createUser() {
  if (this.userForm.valid) {
    const datos = this.userForm.value; 
    
    

    if (this.id) {
      this.serviciosService.editar(this.id, datos).subscribe({
        next: (response: any) => {
          console.log('editar', response);
          alert('Se guardaron los datos correctamente');
          this.dialogRef.close();
          this.router.navigate(['/ipcheck']);
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
          this.dialogRef.close();
          if (confirm('¿Quieres agregar un nuevo usuario?')) {
            this.userForm.reset();
          } else {
            this.router.navigate(['/ipcheck']);
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
closeDialog() {
  this.dialogRef.close(); // Forcefully close the dialog
  console.log("Dialog closed manually"); // Just to verify it's being triggered
}


}