import { UiService } from './ui.service';
import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public JWT: string = null;
  public userDetails: Array<string> = null;

  constructor(private http: HttpService, private router: Router, private ui: UiService) {;
    this.SetDetails(JSON.parse(localStorage.getItem('user')));
  }

  // 0 - id_parafii, 1 - id_user, 2 - admin, 3 - JWT
  SetDetails(list: Array<string>) {
    localStorage.setItem('user', JSON.stringify(list));
    this.userDetails = list;
    this.http.id_parafii = list !== null ? parseInt(list[0]) : null;
    this.http.id_user = list !== null ? parseInt(list[1]) : null;
    this.http.JWT = list !== null ? list[3] : null;
  }

  async login(email: string, haslo: string)
  {
    return new Promise<string>((resolve) => {
      this.http.logowanie(email, haslo).then((res) => {
        if (res !== 'brak' && res !== 'niepoprawne' && res !== 'nieaktywne' && res !== 'blad') {
          const response = JSON.parse(res);
          const user: User = response[0];
          this.SetDetails([user.id_parafii.toString(), user.id_user.toString(), user.admin.toString(), response[1]]);
          setTimeout(() => {
            resolve(user.admin.toString());
          }, 200);
        }
        else
        {
          resolve(res);
        }
      });
    });
  }

  async logout()
  {
    return new Promise<number>((resolve) => {
      this.http.wyloguj().then((res) => {
        if (res === 1) {
          this.SetDetails(null);
          this.router.navigateByUrl('/login').then(() => {
            setTimeout(() => {
              this.ui.showFeedback('succes', 'Pomyślnie wylogowano', 3);
              this.ui.removeLoadingEvent();
            }, 400);
          });
        }
        else {
          this.ui.removeLoadingEvent();
          this.ui.showFeedback('error', 'Wystąpił nieoczekiwany błąd', 2);
        }
        resolve(res);
      });
    });
  }

  get isLogged()
  {
    return this.userDetails !== null;
  }

  get isAdmin()
  {
    return this.userDetails[2] === '1';
  }

}
