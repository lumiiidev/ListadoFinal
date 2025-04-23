import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { AuthService } from './auth/auth-service.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SAR';
  status$: Observable<boolean> | undefined;
  constructor(private authService: AuthService) { }

 ngOnInit() {
  this.status$ = this.authService.isAuthenticated$;
 }

  logout() {
    this.authService.logout();
  }  
}
