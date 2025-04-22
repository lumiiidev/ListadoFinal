import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { IpDialogComponent } from '../../dialogShowIP/ip-dialog/ip-dialog.component';

@Component({
  selector: 'app-ip-dialog',
  imports: [MatDialogModule, MatListModule, MatButtonModule, NgFor],
  templateUrl: './ip-dialog-for-the-registration-form.component.html',
  styleUrl: './ip-dialog-for-the-registration-form.component.css'
})
export class IpDialogComponentForTheRegistrationFormComponent {
  constructor(
    public dialogRef: MatDialogRef<IpDialogComponentForTheRegistrationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { segment: string, ips: string[] }
  ) {}

  selectIp(ip: string) {
    this.dialogRef.close(ip); // Close the dialog and pass the selected IP
  }

  close() {
    this.dialogRef.close(); // Close without selecting an IP
  }
}