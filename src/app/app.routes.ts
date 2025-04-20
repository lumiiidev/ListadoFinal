import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { ListadoIpsComponent } from './listado/listado-ips-component/listado-ips-component.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AgregarUsuariosComponent } from './crear/agregar-usuarios/agregar-usuarios.component';
import { AuthGuard } from './auth/auth-guard.guard';
import { RegadminComponent } from './regadmin/regadmin/regadmin.component';
import { RedirectComponent } from './redirect/redirect/redirect.component';
import { loginGuard } from './auth/loginGuard/login.guard';


export const routes: Routes = [
    {path: '', redirectTo: 'redirect', pathMatch: 'full'},
    {path: 'redirect', component: RedirectComponent },
    {path: 'login', component: LoginComponent, canActivate: [loginGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'crear', component: AgregarUsuariosComponent, canActivate: [AuthGuard]},
    {path: 'crear/:id', component: AgregarUsuariosComponent, canActivate: [AuthGuard]},
    {path: 'listado', component: ListadoIpsComponent, canActivate: [AuthGuard]},
    {path: 'regadmin', component: RegadminComponent,canActivate: [AuthGuard]},
    
    {path: '**', redirectTo: 'redirect'}
    
]
