import { GivePasswordComponent } from './give-password/give-password.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/remind-password', pathMatch: 'full'},
  // {path: 'main', component: },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'remind-password', component: RemindPasswordComponent},
  {path: 'give-password', component: GivePasswordComponent},
  {path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
