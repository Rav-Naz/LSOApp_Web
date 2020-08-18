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
import { AcolythesMessagesComponent } from './admin-view/acolythes-messages/acolythes-messages.component';
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
    AcolytheDetailsComponent
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
    { provide: LOCALE_ID, useValue: "pl-PL" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
