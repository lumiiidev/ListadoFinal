import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}



  showAlert(message: string): Observable<void> {
    return this.dialog.open(DialogComponent, {
      data: { message, confirm: false }
    }).afterClosed(); // <-- this returns an observable
  }
  

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message, confirm: true }
    });

    return dialogRef.afterClosed().toPromise();
  }
}
