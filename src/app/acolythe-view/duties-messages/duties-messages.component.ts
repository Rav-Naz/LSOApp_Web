import { WiadomosciService } from './../../services/wiadomosci.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';
import { Wiadomosc } from 'src/app/models/wiadomosci.model';

@Component({
  selector: 'app-duties-messages',
  templateUrl: './duties-messages.component.html',
  styleUrls: ['./duties-messages.component.css']
})
export class DutiesMessagesComponent {

}
