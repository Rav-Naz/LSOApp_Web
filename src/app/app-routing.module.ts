import { AcolythesMessagesComponent } from './admin-view/acolythes-messages/acolythes-messages.component';
import { MassComponent } from './admin-view/mass/mass.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { GivePasswordComponent } from './give-password/give-password.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'remind-password', component: RemindPasswordComponent},
  {path: 'give-password', component: GivePasswordComponent},
  {path: 'admin-view', component: AdminViewComponent, children: [
    {path: 'mass', component: MassComponent, outlet: 'main'},
    {path: 'acolythes-messages', component: AcolythesMessagesComponent, outlet: 'main'},
    // {path: '**', redirectTo: '/mass'},
  ]},
  {path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
