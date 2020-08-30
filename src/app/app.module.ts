import { AdminGuard } from './services/admin-guard.service';
import { AuthGuard } from './services/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GivePasswordComponent } from './give-password/give-password.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { MassComponent } from './admin-view/mass/mass.component';
import { UriPipe } from './pipes/uri.pipe';
import { CheckboxStatusComponent } from './shared/checkbox-status/checkbox-status.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import localePl from '@angular/common/locales/pl';
import {registerLocaleData} from '@angular/common';
import { CheckboxComponent } from './shared/checkbox/checkbox.component';
import { NewAcolytheComponent } from './admin-view/new-acolythe/new-acolythe.component';
import { PunctationComponent } from './admin-view/punctation/punctation.component';
import { AcolytheDetailsComponent } from './admin-view/acolythe-details/acolythe-details.component';
import { EditEventsComponent } from './admin-view/edit-events/edit-events.component';
import { DeleteParishComponent } from './admin-view/delete-parish/delete-parish.component';
import { EditParishDetailsComponent } from './admin-view/edit-parish-details/edit-parish-details.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { LoginAsComponent } from './shared/login-as/login-as.component';
import { ActivityIndicatorComponent } from './shared/activity-indicator/activity-indicator.component';
import { AcolytheViewComponent } from './acolythe-view/acolythe-view.component';
import { DutiesMessagesComponent } from './acolythe-view/duties-messages/duties-messages.component';
import { UserDetailsComponent } from './acolythe-view/user-details/user-details.component';
import { DeleteAccountComponent } from './acolythe-view/delete-account/delete-account.component';
import { ChangePasswordComponent } from './acolythe-view/change-password/change-password.component';
import { DutiesComponent } from './acolythe-view/duties-messages/duties/duties.component';
import { MessagesComponent } from './acolythe-view/duties-messages/messages/messages.component';
import { AcolythesComponent } from './admin-view/acolythes-messages/acolythes/acolythes.component';
import { MessagesAdminComponent } from './admin-view/acolythes-messages/messages-admin/messages-admin.component';
import { AcolythesMessagesComponent } from './admin-view/acolythes-messages/acolythes-messages.component';
registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GivePasswordComponent,
    RemindPasswordComponent,
    AdminViewComponent,
    AcolythesMessagesComponent,
    MassComponent,
    UriPipe,
    CheckboxStatusComponent,
    CheckboxComponent,
    NewAcolytheComponent,
    PunctationComponent,
    AcolytheDetailsComponent,
    EditEventsComponent,
    DeleteParishComponent,
    EditParishDetailsComponent,
    LoadingComponent,
    ConfirmComponent,
    LoginAsComponent,
    ActivityIndicatorComponent,
    AcolytheViewComponent,
    DutiesMessagesComponent,
    UserDetailsComponent,
    DeleteAccountComponent,
    ChangePasswordComponent,
    DutiesComponent,
    MessagesComponent,
    AcolythesComponent,
    MessagesAdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl-PL" },
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
