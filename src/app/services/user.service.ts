import { HttpService } from './http.service';
import { Wydarzenie } from './../models/wydarzenie.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Dyzur } from './../models/dyzur.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) { }

  public wersja = '2.2.0'; // Wykorzystanie: ustawienia-m, ustawienia-o
  private user: User;

  userDyzury: Array<Dyzur> = [];
  public opiekun: boolean = undefined;
  private _czyOpiekun = new BehaviorSubject<boolean>(false);
  private userDyzurySub = new BehaviorSubject<Array<Wydarzenie>>(null);
  private userSub = new BehaviorSubject<User>(null);

  get czyOpiekun() {
    return this._czyOpiekun.asObservable();
  }

  get UserSub() { // Wykorzystanie: dyzury, dane-profilowe
    return this.userSub.asObservable();
  }

  get UserImieINazwisko() { // Wykorzystanie: dyzury, dane-profilowe
    return this.user ? this.user.imie + ' ' + this.user.nazwisko : null;
  }

  get UserDyzurySub() // Wykorzystanie: dyzury
  {
    return this.userDyzurySub.asObservable();
  }

  get UserID() {
    return this.user ? this.user.id_user : null;
  }

  get UserStopien() {
    return this.user ? this.user.stopien : null;
  }

  get UserPerm() {
    return this.user ? this.user.admin : null;
  }

  get UserEmail() {
    return this.user ? this.user.email : null;
  }

  async zmianaOpiekuna(bool: boolean) {
    return new Promise<number>((resolve) => {
      this.opiekun = bool;
      this._czyOpiekun.next(bool);
      setTimeout(() => {
        resolve(1);
      }, 300);
    });
  }

  zmienUsera(user: User) {
    this.user = user;
    this.userSub.next(user);
  }

  async mojeDyzury(id_user: number, stopien: number) { // Wykorzystanie: ministrant-dyzury, ministranci-szczegoly
    return new Promise<number>(resolve => {
      this.http.pobierzDyzuryDlaMinistranta(id_user, stopien).then(res => {
        if (res === null) {
          resolve(404);
          return;
        }
        this.userDyzurySub.next(res);
        resolve(1);
      });
    });
  }

  async miejsceWRankignu() {
    return new Promise<number>((resolve) => {
      this.http.miejsceWRankingu().then(res => {
        resolve(res);
      });
    });
  }

  async zmienDane(telefon: string, ulica: string, kod: string, miasto: string) { // Wykorzystanie: dane-profilowe
    return new Promise<number>((resolve) => {
      this.http.aktualizacjaDanychMinistranta(ulica, kod, miasto, telefon).then(res => {
        if (res === 0 || res === 404) {
          resolve(res);
        }
        else {
          this.http.pobierzMinistranta(res).then(user => {
            this.userSub.next(user);
            resolve(1);
          });
        }
      });
    });
  }

  pobierzUsera() {
    return new Promise<number>((resolve) => {
      this.http.pobierzMinistranta(-1).then(user => {
        this.zmienUsera(user);
        resolve(1);
      });
    });
  }

  async zmienHaslo(aktualne_haslo:string,nowe_haslo: string) { //Wykorzystanie: dane-profilowe
    return new Promise<number>((resolve) => {
        this.http.zmienHaslo(aktualne_haslo, nowe_haslo).then(res => {
            resolve(res);
        });
    });
}

  async usunKonto(haslo: string)
  {
      return new Promise<number>((resolve) => {
          this.http.usunKontoUsera(this.user.admin, haslo).then(res => {
              resolve(res);
          });
      });
  }
}
