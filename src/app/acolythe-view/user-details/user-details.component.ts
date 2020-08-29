import { UiService } from './../../services/ui.service';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user.model';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  user: User = {
    id_user: 1,
    id_diecezji: 0,
    id_parafii: 2,
    punkty: 0,
    stopien: 0,
    imie: '',
    nazwisko: '',
    ulica: '',
    kod_pocztowy: '',
    miasto: '',
    email: '',
    telefon: '',
    aktywny: 0,
    admin: 0,
    ranking: 1,
    powiadomienia: 0
  };
  zmiana = false;

  constructor(private router: Router, private userService: UserService, private ui: UiService) { }

  ngOnInit(): void {
    this.userSub = this.userService.UserSub.subscribe(user => {
      if (user === null || user === undefined) { return; }
      this.user = user;
    });
  }

  get isDisabled() {
    return this.user.id_user === 1;
  }

  anuluj() {
    this.ui.wantToContinue('Zmiany nie zostaną zapisane.', this.zmiana).then(continu => {
      if (continu) {
        this.router.navigateByUrl('/acolythe-view/(acolythe:duties-messages)');
      }
    });
  }

  zapisz() {
    this.userService.zmienDane(this.user.telefon, this.user.ulica, this.user.kod_pocztowy, this.user.miasto).then(res => {
      if (res === 1) {
        setTimeout(() => {
          this.ui.showFeedback('succes', 'Dane zostały zmienione', 3);
          this.anuluj();
        }, 400);
      }
      else {
        this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
      }
      this.zmiana = false;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
