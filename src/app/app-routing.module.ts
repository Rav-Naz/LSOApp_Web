import { AcolythesComponent } from './admin-view/acolythes-messages/acolythes/acolythes.component';
import { AdminGuard } from './services/admin-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserDetailsComponent } from './acolythe-view/user-details/user-details.component';
import { ChangePasswordComponent } from './acolythe-view/change-password/change-password.component';
import { DutiesMessagesComponent } from './acolythe-view/duties-messages/duties-messages.component';
import { AcolytheViewComponent } from './acolythe-view/acolythe-view.component';
import { EditParishDetailsComponent } from './admin-view/edit-parish-details/edit-parish-details.component';
import { DeleteParishComponent } from './admin-view/delete-parish/delete-parish.component';
import { EditEventsComponent } from './admin-view/edit-events/edit-events.component';
import { AcolytheDetailsComponent } from './admin-view/acolythe-details/acolythe-details.component';
import { PunctationComponent } from './admin-view/punctation/punctation.component';
import { NewAcolytheComponent } from './admin-view/new-acolythe/new-acolythe.component';
import { AcolythesMessagesComponent } from './admin-view/acolythes-messages/acolythes-messages.component';
import { MassComponent } from './admin-view/mass/mass.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { GivePasswordComponent } from './give-password/give-password.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteAccountComponent } from './acolythe-view/delete-account/delete-account.component';
import { MessagesComponent } from './acolythe-view/duties-messages/messages/messages.component';
import { DutiesComponent } from './acolythe-view/duties-messages/duties/duties.component';
import { MessagesAdminComponent } from './admin-view/acolythes-messages/messages-admin/messages-admin.component';

const routes: Routes = [
  {path: '', redirectTo: '/acolythe-view', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'remind-password', component: RemindPasswordComponent},
  {path: 'give-password', component: GivePasswordComponent},
  {path: 'admin-view', component: AdminViewComponent, canActivate: [AuthGuard, AdminGuard], children: [
    {path: 'mass', component: MassComponent, outlet: 'admin'},
    {path: 'acolythes-messages', component: AcolythesMessagesComponent, outlet: 'admin'},
    {path: 'messages', component: MessagesAdminComponent, outlet: 'admin'},
    {path: 'acolythes', component: AcolythesComponent, outlet: 'admin'},
    {path: 'new-acolythe', component: NewAcolytheComponent, outlet: 'admin'},
    {path: 'punctation', component: PunctationComponent, outlet: 'admin'},
    {path: 'acolythe-details/:id', component: AcolytheDetailsComponent, outlet: 'admin'},
    {path: 'edit-events', component: EditEventsComponent, outlet: 'admin'},
    {path: 'delete-parish', component: DeleteParishComponent, outlet: 'admin'},
    {path: 'edit-parish-details', component: EditParishDetailsComponent, outlet: 'admin'}
    // {path: '**', redirectTo: '/mass'},
  ]},
  {path: 'acolythe-view', component: AcolytheViewComponent, canActivate: [AuthGuard], children: [
    {path: 'duties-messages', component: DutiesMessagesComponent, outlet: 'acolythe'},
    {path: 'duties', component: DutiesComponent, outlet: 'acolythe'},
    {path: 'messages', component: MessagesComponent, outlet: 'acolythe'},
    {path: 'change-password', component: ChangePasswordComponent, outlet: 'acolythe'},
    {path: 'delete-account', component: DeleteAccountComponent, outlet: 'acolythe'},
    {path: 'user-details', component: UserDetailsComponent, outlet: 'acolythe'},
    // {path: '**', redirectTo: '/mass'},
  ]},
  {path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
