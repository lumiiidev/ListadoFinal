import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ip-dialog',
  imports: [MatDialogModule, MatListModule, MatButtonModule, NgFor],
  templateUrl: './ip-dialog.component.html',
  styleUrl: './ip-dialog.component.css'
})
export class IpDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { segment: string, ips: string[] }) {}
}
