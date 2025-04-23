import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor } from '@angular/common';
import { IpDialogComponent } from '../../dialogShowIP/ip-dialog/ip-dialog.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ip-dialog',
  imports: [FormsModule, MatInputModule, MatDialogModule, MatListModule, MatButtonModule, NgFor, MatFormField, CommonModule],
  templateUrl: './ip-dialog-for-the-registration-form.component.html',
  styleUrl: './ip-dialog-for-the-registration-form.component.css'
})
export class IpDialogComponentForTheRegistrationFormComponent {
  filterText: string = '';
  filteredIps: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<IpDialogComponentForTheRegistrationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { segment: string, ips: string[] }
  ) {
    this.filteredIps = [...data.ips]; // Start with all IPs
  }
  applyFilter(): void {
    const text = this.filterText.trim().toLowerCase();
    if (text === '') {
      this.filteredIps = [...this.data.ips];
    } else {
      this.filteredIps = this.data.ips.filter(ip => ip.toLowerCase().includes(text));
    }
  }

  selectIp(ip: string) {
    this.dialogRef.close(ip); // Close the dialog and pass the selected IP
  }

  close() {
    this.dialogRef.close(); // Close without selecting an IP
  }
}