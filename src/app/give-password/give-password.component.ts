import { Router } from '@angular/router';
import { HttpService } from './../services/http.service';
import { UiService } from './../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-give-password',
  templateUrl: './give-password.component.html',
  styleUrls: ['./give-password.component.css']
})
export class GivePasswordComponent {

  public _email: string = null;
  public _password: string = null;
  public _cofirmPassword: string = null;
  public _code: string = null;
  public ladowanie = false;

  constructor(private ui: UiService, private httpService: HttpService, private router: Router) { }

  get isPasswordSame() {
    return this._password === this._cofirmPassword ? true : false;
  }

  wyslij() {

    this.ladowanie = true;

    this.httpService.aktywacjaUsera(this._email, this._code, this._password).then((res) => {
      if (res === 'nieistnieje') {
        this.ui.showFeedback('warning', 'Brak konta z przypisanym danym adresem e-mail', 3);
      }
      else if (res === 'niepoprawny') {
        this.ui.showFeedback('warning', 'Wprowadzony kod aktywacyjny jest niepoprawny', 3);
      }
      else if (res === 'niemakodu' || res === 'wygaslo') {
        this.ui.showFeedback('warning', 'Kod aktywacyjny nie został jeszcze wygenerowany lub wygasł', 3);
      }
      else if (res.hasOwnProperty('changedRows')) {
        this.router.navigateByUrl('login');
        setTimeout(() => {
          this.ui.showFeedback('succes', 'Hasło do konta zostało nadane! Możesz sie teraz zalogować', 3);
        }, 200);
      }
      else {
        this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
      }
      this.ladowanie = false;
    });

  }

}
