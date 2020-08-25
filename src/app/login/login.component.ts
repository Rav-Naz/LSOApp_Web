import { LoginAsComponent } from './../shared/login-as/login-as.component';
import { UserService } from './../services/user.service';
import { User } from './../models/user.model';
import { UiService } from './../services/ui.service';
import { HttpService } from './../services/http.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public _email: string = null;
  public _password: string = null;

  @ViewChild(LoginAsComponent) loginAs: LoginAsComponent;

  constructor(private http: HttpService, private ui: UiService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    // this._email = localStorage.getItem('email');
    // this._haslo = localStorage.getItem('pass');
    // setTimeout(() => {
    //   this.passwordInput.nativeElement.focus();
    // }, 1000);
  }

  signIn() {
    this.ui.addLoadingEvent();
    this.http.logowanie(this._email, this._password).then(res => {
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
        let user: User = JSON.parse(JSON.stringify(res));
        // this.userService.zmienUsera(user);

        if (user.admin === 1) {
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
                    this.router.navigate(['/menu']);
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
              this.router.navigate(['/menu']);
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
}
