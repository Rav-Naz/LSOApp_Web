import { ParafiaService } from './../services/parafia.service';
import { UserService } from './../services/user.service';
import { User } from './../models/user.model';
import { UiService } from './../services/ui.service';
import { HttpService } from './../services/http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public _email: string = null;
  public _password: string = null;

  ladowanie = false;

  constructor(private http: HttpService, private ui: UiService, private userService: UserService, private parafiaService: ParafiaService, private router: Router) { }

  ngOnInit(): void {
    // this._email = localStorage.getItem('email');
    // this._haslo = localStorage.getItem('pass');
  }

  signIn() {
    this.http.logowanie(this._email, this._password).then(res => {
      if (res === 'brak' || res === 'niepoprawne') {
          this.ladowanie = false;
          this.ui.showFeedback('warning', 'Niepoprawny adres e-mail i/lub hasło', 3);
      }
      else if (res === 'nieaktywne') {
          this.ladowanie = false;
          this.ui.showFeedback('warning', 'Musisz najpierw aktywować konto aby móc się zalogować', 3);
      }
      else if (res === 'blad') {
          this.ladowanie = false;
          this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);

      }
      else {
          let user: User = JSON.parse(JSON.stringify(res));
          // this.userService.zmienUsera(user);

          if (user.admin === 1) {
              let result = 1;
              if (result !== undefined) {
                      this.ladowanie = true;
                      if (result === 1) {
                          this.userService.zmianaOpiekuna(true).then(resss => {
                              if (resss === 1) {
                                this.router.navigate(['/admin-view']);
                              }
                              else {
                                  this.ladowanie = false;
                                  this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);
                              }
                          });
                      }
                      else if (result === 0) {

                          this.userService.zmianaOpiekuna(false).then(res => {
                              if (res === 1) {
                                  this.router.navigate(['/menu']);
                              }
                              else {
                                  this.ladowanie = false;
                                  this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);
                              }
                          });

                      }
                  }
                  else {
                      this.ladowanie = false;
                  }
          }
          else {
              this.userService.zmianaOpiekuna(false).then(res => {
                  if (res === 1) {
                    this.router.navigate(['/menu']);
                  }
                  else {
                      this.ladowanie = false;
                      this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);
                  }
              });
          }
      }
  });
  }
}
