import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as sha512 from 'js-sha512';
import { Wiadomosc } from '../models/wiadomosci.model';
import { User } from '../models/user.model';
import { Wydarzenie } from '../models/wydarzenie.model';
import { Obecnosc } from '../models/obecnosc.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = 'https://baza.lsoapp.smarthost.pl/2.2.0';
  private smart = '4ad5a86f50b778a2050c51335e97d234';
  private JWT: string = null;

  private id_parafii: number = null;
  private id_user: number = null;

  private os = 'Web';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
  });

  nadajId_Parafii(id_parafii: number) {
    this.id_parafii = id_parafii;
    localStorage.setItem('id_parafii', id_parafii.toString());
  }

  nadajId_User(id_user: number) {
    this.id_user = id_user;
    localStorage.setItem('id_user', id_user.toString());
  }

  nadajJWT(JWT: string) {
    this.JWT = JWT;
    localStorage.setItem('JWT', JWT.toString());
  }

  constructor(private http: HttpClient) {
    const id_par = parseInt(localStorage.getItem('id_parafii'));
    const id_use = parseInt(localStorage.getItem('id_user'));
    const JWT = localStorage.getItem('JWT');
    if (id_par !== null) {
      this.id_parafii = id_par;
    }
    if (id_use !== null) {
      this.id_user = id_use;
    }
    if (JWT !== null) {
      this.JWT = JWT;
    }
  }

  ////////////////// ZAPYTANIA BEZ JWT //////////////////

  // LOGOWANIE
  async logowanie(email: string, haslo: string) {
    return new Promise<string>(resolve => {
      this.http.post(this.url + '/login',
        { email, haslo: sha512.sha512.hmac('mSf', haslo), smart: this.smart, urzadzenie_id: null, os: this.os },
        { headers: this.headers }).subscribe(res => {
          if (res === 'nieaktywne') {
            resolve('nieaktywne');
          }
          else if (res === 'brak') {
            resolve('brak');
          }
          else if (res === 'niepoprawne') {
            resolve('niepoprawne');
          }
          else if (res[0].hasOwnProperty('id_parafii')) {
            this.nadajJWT(res[1]);
            this.nadajId_User(res[0].id_user);
            this.nadajId_Parafii(res[0].id_parafii);
            resolve(JSON.parse(JSON.stringify(res[0])));
          }
          else {
            resolve('blad');
          }
        }, err => {
          resolve('blad');
        });
    });
  }

  ////////////////// ZAPYTANIA Z JWT //////////////////

  // POBIERANIE DANCYH PARAFII
  async pobierzParafie() {
    return new Promise<string>(resolve => {

      this.http.post(this.url + '/parish', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
          if (res.hasOwnProperty('id_parafii')) {
            resolve(JSON.parse(JSON.stringify(res)));
          }
          else if (res === 'You have not permission to get the data') {
            resolve('jwt');
          }
          else {
            resolve('blad');
          }
        }, err => {
          resolve('blad');
        });
    });
  }

  // POBIERANIE WIADOMOŚCI
  async pobierzWidaomosci(do_opiekuna: number, limit: number) {
    return new Promise<Array<Wiadomosc>>(resolve => {

      this.http.post(this.url + '/messages', {
        id_parafii: this.id_parafii, do_opiekuna,
        smart: this.smart, limit, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(JSON.parse(JSON.stringify(null)));
        }
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  // USUWANIE WIADOMOŚCI
  async usunWiadomosc(id_wiadomosci: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_message', { id_wiadomosci, smart: this.smart, jwt: this.JWT }
        , { headers: this.headers }).subscribe(res => {
          if (res.hasOwnProperty('insertId')) {
            resolve(1);
          }
          else if (res === 'You have not permission to get the data') {
            resolve(404);
          }
          else {
            resolve(0);
          }
        }, err => {
          resolve(0);
        });
    });
  }

  // WYSYŁANIE WIADOMOŚCI
  async wyslijWidaomosc(tresc: string) {
    return new Promise<number>(resolve => {
      this.http.post(this.url + '/new_message', {
        autor_id: this.id_parafii, odbiorca_id: this.id_parafii,
        tresc: encodeURI(tresc), linkobrazu: null, smart: this.smart, jwt: this.JWT, id_user: this.id_user
      },
        { headers: this.headers }).subscribe(res => {
          if (res === 'wyslano') {
            resolve(1);
          }
          else if (res === 'You have not permission to get the data') {
            resolve(404);
          }
          else {
            resolve(0);
          }
        }, err => {
          resolve(0);
        });
    });
  }

  // POBIERANIE MINISTRANTÓW
  async pobierzMinistrantow() {
    return new Promise<Array<User>>(resolve => {

      this.http.post(this.url + '/ministranci', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
          if (res === 'You have not permission to get the data') {
            resolve(null);
          }
          else {
            resolve(JSON.parse(JSON.stringify(res)));
          }
        }), err => {
          resolve([]);
        };
    });
  }

  //USUWANIE MINISTRANTA
  async usunMinistranta(id_user: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_user', { id_user: id_user, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
          if (res === 'zakonczono') {
            resolve(1);
          }
          else if (res === 'You have not permission to get the data') {
            resolve(404);
          }
          else {
            resolve(0);
          }
        }, err => {
          resolve(0);
        });
    });
  }

  //POBIERANIE DANYCH O MINISTRANCIE
  async pobierzMinistranta(id_user: number) {
    return new Promise<User>(resolve => {
      this.http.post(this.url + '/ministrant', { id_user: id_user === -1 ? this.id_user : id_user, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
          if (res === 'You have not permission to get the data') {
            resolve(JSON.parse(JSON.stringify([])));
          }
          else {
            resolve(JSON.parse(JSON.stringify(res)));
          }
        });
    });
  }

  //POBIERANIE WYDARZEŃ NA DANY DZIEŃ
  async pobierzWydarzeniaNaDanyDzien(dzien: number, data_dokladna: string) {
    return new Promise<Array<Wydarzenie>>(resolve => {

      this.http.post(this.url + '/events', {
        id_parafii: this.id_parafii, dzien: dzien, smart: this.smart,
        jwt: this.JWT, data_dokladna: data_dokladna
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(null);
          return;
        }
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  //POBIERANIE DYŻURÓW DO DANEGO WYDARZENIA
  async pobierzDyzuryDoWydarzenia(id_wydarzenia: number) {
    return new Promise<Array<User>>(resolve => {

      this.http.post(this.url + '/event_duty', {
        id_wydarzenia: id_wydarzenia, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(JSON.parse(JSON.stringify(null)));
          return;
        }
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  //POBIERANIE OBECNOSCI DO DANEGO WYDARZENIA
  async pobierzObecnosciDoWydarzenia(id_wydarzenia: number, data: Date) {
    return new Promise<Array<User>>(resolve => {
      let date = data;
      date.setHours(2);

      this.http.post(this.url + '/presence', {
        id_wydarzenia: id_wydarzenia, data: date.toJSON(),
        id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  //POBIERANIE SPECJALNYCH WYDARZEŃ
  async pobierzSpecjalneWydarzenia() {
    return new Promise<string>(resolve => {
      this.http.post(this.url + '/special_events', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
          resolve(JSON.stringify(res));
        }, err => {
          resolve('');
        });
    });
  }

  //AKTUALIZOWANIE ISTNIEJĄCEJ OBECNOŚCI
  async updateObecnosci(obecnosc: Obecnosc, punkty_dod_sluzba: number, punkty_uj_sluzba: number, punkty_dodatkowe: number, punkty_nabozenstwo: number,
    punkty_dod_zbiorka: number, punkty_uj_zbiorka: number, typ_wydarzenia: number) {
    return new Promise<number>(resolve => {
      this.http.post(this.url + '/update_presence', {
        id_obecnosci: obecnosc.id, status: obecnosc.status, punkty_dod_sluzba: punkty_dod_sluzba,
        punkty_uj_sluzba: punkty_uj_sluzba, punkty_dodatkowe: punkty_dodatkowe, punkty_nabozenstwo: punkty_nabozenstwo, punkty_dod_zbiorka: punkty_dod_zbiorka,
        punkty_uj_zbiorka: punkty_uj_zbiorka, id_user: obecnosc.id_user, typ_wydarzenia: typ_wydarzenia, typ: obecnosc.typ, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'brak') {
          resolve(0);
        }
        else if (res === "You have not permission to get the data") {
          resolve(404);
        }
        else {
          resolve(1);
        }
      }, err => {
        resolve(0);
      });
    });
  }

  //DODAWANIE NOWEJ OBECNOŚCI
  async nowaObecnosc(obecnosc: Obecnosc, punkty_dod_sluzba: number, punkty_uj_sluzba: number, punkty_dodatkowe: number, punkty_nabozenstwo: number, punkty_dod_zbiorka: number, punkty_uj_zbiorka: number, typ_wydarzenia: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/add_presence', {
        id_wydarzenia: obecnosc.id_wydarzenia, id_user: obecnosc.id_user,
        data: obecnosc.data, status: obecnosc.status, punkty_dod_sluzba: punkty_dod_sluzba, punkty_uj_sluzba: punkty_uj_sluzba,
        punkty_dodatkowe: punkty_dodatkowe, punkty_nabozenstwo: punkty_nabozenstwo, punkty_dod_zbiorka: punkty_dod_zbiorka,
        punkty_uj_zbiorka: punkty_uj_zbiorka, typ: obecnosc.typ, typ_wydarzenia: typ_wydarzenia, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        resolve(1);
      }, err => {
        resolve(0);
      });
    });
  }

}
