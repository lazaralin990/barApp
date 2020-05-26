import { ResendEmailComponent } from './components/resend-email/resend-email.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthGuard } from './auth.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ManagementComponent } from './components/management/management.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { EstablecimientoComponent } from './components/establecimiento/establecimiento.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCartaComponent } from './components/view-carta/view-carta.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path: '',  redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'establecimiento', component: EstablecimientoComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgot', component: ForgotPasswordComponent},
  {path: 'manage', component: ManagementComponent},
  {path: 'userMgmt', component: UserManagementComponent},
  {path: 'contacto', component: ContactComponent},
  {path: 'mydashboard', component: MyDashboardComponent, canActivate: [AuthGuard]},
  {path: 'editar/:id', component: EditProfileComponent, canActivate: [AuthGuard]},
  {path: 'view/:id', component: ViewCartaComponent},
  {path: 'resend', component: ResendEmailComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
