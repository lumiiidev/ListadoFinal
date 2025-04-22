import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


@Component({
  imports: [CommonModule, MatDialogContent, MatDialogActions],
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, confirm?: boolean }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
    console.log('Confirm clicked');
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
    console.log('Cancel clicked');
  }
  
}
