import { AuthService } from './../services/auth.service';
import { LoginAsComponent } from './../shared/login-as/login-as.component';
import { UserService } from './../services/user.service';
import { UiService } from './../services/ui.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public _email: string = null;
  public _password: string = null;

  @ViewChild(LoginAsComponent) loginAs: LoginAsComponent;

  constructor(private ui: UiService, private userService: UserService,
              private router: Router, private authService: AuthService) { }

  signIn() {
    if (!this.isEmailValid || !this.isPassowrdValid)
    {
      return;
    }
    this.ui.addLoadingEvent();
    this.authService.login(this._email, this._password).then(res => {
      if (res === 'brak' || res === 'niepoprawne') {
        this.ui.showFeedback('warning', 'Niepoprawny adres e-mail i/lub hasło', 3);
        this.ui.removeLoadingEvent();
      }
      else if (res === 'nieaktywne') {
        this.ui.showFeedback('warning', 'Musisz najpierw aktywować konto aby móc się zalogować', 3);
        this.ui.removeLoadingEvent();
      }
      else if (res === 'blad') {
        this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);
        this.ui.removeLoadingEvent();
      }
      else {

        if (res === '1') {
          this.ui.removeLoadingEvent();
          this.loginAs.awaitToDecision().then(result => {
            this.ui.addLoadingEvent();
            if (result !== undefined) {
              if (result === true) {
                this.userService.zmianaOpiekuna(true).then(resss => {
                  if (resss === 1) {
                    this.router.navigate(['/admin-view']);
                  }
                  else {
                    this.ui.removeLoadingEvent();
                    this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz dobre połączenie z internetem', 5);
                  }
                });
              }
              else if (result === false) {

                this.userService.zmianaOpiekuna(false).then(res => {
                  if (res === 1) {
                    this.router.navigate(['/acolythe-view']);
                  }
                  else {
                    this.ui.removeLoadingEvent();
                    this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz dobre połączenie z internetem', 5);
                  }
                });

              }
            }
            else {
              this.ui.removeLoadingEvent();
            }
          });
        }
        else {
          this.userService.zmianaOpiekuna(false).then(res => {
            if (res === 1) {
              this.router.navigate(['/acolythe-view']);
            }
            else {
              this.ui.removeLoadingEvent();
              this.ui.showFeedback('error', 'Wystąpił problem z połączeniem. Sprawdź czy posiadasz najnowszą wersję aplikacji oraz dobre połączenie z internetem', 5);
            }
          });
        }
      }
    });
  }

  onEnter(event)
  {
    if (event.key === 'Enter') { this.signIn(); }
  }


  get isEmailValid()
  {
    return new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(this._email);
  }

  get isPassowrdValid()
  {
    return this._password.length > 1;
  }
}
