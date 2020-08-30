import { AuthService } from './auth.service';
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

  public JWT: string = null;
  public id_parafii: number = null;
  public id_user: number = null;

  private os = 'Web';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
  });

  constructor(private http: HttpClient) {

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
            resolve(JSON.stringify(res));
          }
          else {
            resolve('blad');
          }
        }, err => {
          resolve('blad');
        });
    });
  }

  // AKTYWACJA USERA
  async aktywacjaUsera(email: string, kod_aktywacyjny: string, haslo: string) {
    return new Promise<string>(resolve => {

      this.http.post(this.url + '/activate', { email, kod_aktywacyjny, haslo: sha512.sha512.hmac('mSf', haslo), smart: this.smart }, { headers: this.headers }).subscribe(res => {
        if (res === 'nieistnieje') {
          resolve('nieistnieje');
        }
        else if (res === 'niepoprawny') {
          resolve('niepoprawny');
        }
        else if (res === 'niemakodu') {
          resolve('niemakodu');
        }
        else if (res === 'wygaslo') {
          resolve('wygaslo');
        }
        else if (res.hasOwnProperty('changedRows')) {
          resolve(JSON.parse(JSON.stringify(res)));
        }
        else {
          resolve('blad');
        }
      }, err => {
        resolve('blad');
      });
    });
  }

  // UTWORZENIE NOWEJ PARAFII
  async rejestracja(nazwa_parafii: string, id_diecezji: number, miasto: string,
    id_typu: number, stopien: number, imie: string, nazwisko: string, email: string) {

    return new Promise<number>(resolve => {

      this.http.post(this.url + '/register', {
        nazwa_parafii, id_diecezji,
        miasto, id_typu, stopien, imie, nazwisko,
        email, smart: this.smart
      }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(1);
        }
        else if (res.hasOwnProperty('code')) {
          const code = JSON.parse(JSON.stringify(res));
          if (code.code === 'ER_DUP_ENTRY') {
            resolve(2);
          }
          else {
            resolve(0);
          }
        }
        else if (res === 'istnieje') {
          resolve(2);
        }
        else if (res === 'ponowne') {
          resolve(3);
        }
        else {
          resolve(0);
        }
      }, err => {
        resolve(0);
      });
    });
  }

  // PRZYPOMNIENIE HASŁA
  async przypomnij(email: string) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/remind', { email, smart: this.smart }, { headers: this.headers }).subscribe(res => {
        const response = JSON.parse(JSON.stringify(res));
        resolve(response.changedRows);
      }, err => {
        resolve(0);
      });
    });
  }

  ////////////////// ZAPYTANIA Z JWT //////////////////

  // WYLOGOWANIE
  async wyloguj() {
    return new Promise<number>(resolve => {
      this.http.post(this.url + '/logout', { smart: this.smart, id_user: this.id_user, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res === 'wylogowano') {
          resolve(1);
        }
        else {
          resolve(0);
        }
      }, err => {
        resolve(0);
      });
    });
  }

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

  // USUWANIE PARAFII
  async usuwanieParafii(haslo: string) {

    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_parish', { id_user: this.id_user, id_parafii: this.id_parafii, haslo: sha512.sha512.hmac('mSf', haslo), smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {

        if (res === 'zakonczono') {
          resolve(1);
        }
        else if (res === 'niepoprawne') {
          resolve(2);
        }
        else if (res === 'nieistnieje') {
          resolve(3);
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

  // WYZEREUJ PUNKTY
  async wyzerujPunkty() {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/reset_points', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // AKTUALIZACJA PUNKTÓW
  async aktualizacjaPunktow(punkty_dod_sluzba: number, punkty_uj_sluzba: number, punkty_dodatkowe: number, punkty_nabozenstwo: number, punkty_dod_zbiorka: number, punkty_uj_zbiorka: number) {
    return new Promise<any>(resolve => {
      this.http.post(this.url + '/update_points', { punkty_dod_sluzba, punkty_uj_sluzba, punkty_dodatkowe, punkty_nabozenstwo, punkty_dod_zbiorka, punkty_uj_zbiorka, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // AKTUALIZACJA DANYCH PARAFII
  async aktualizacjaDanychParafii(nazwa_parafii: string, id_diecezji: number, miasto: string, id_typu: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/update_parish', { nazwa_parafii, id_diecezji, miasto, id_typu, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(1);
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

  // MIEJSCE W RANKINGU
  async miejsceWRankingu() {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/user_ranking', { id_user: this.id_user, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(404);
          return;
        }
        const mijesce = JSON.parse(JSON.stringify(res));
        if (mijesce === null) {
          resolve(0);
        }
        else {
          resolve(mijesce);
        }
      }, err => {
        resolve(0);
      });
    });
  }

  // USUWANIE MINISTRANTA
  async usunMinistranta(id_user: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_user', { id_user, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
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

  // DODAWANIE NOWEGO MINISTRANTA
  async nowyMinistrant(stopien: number, imie: string, nazwisko: string, email: string) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/new_user', { id_parafii: this.id_parafii, stopien, imie, nazwisko, email, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(1);
        }
        else if (res === 'You have not permission to get the data') {
          resolve(404);
        }
        else if (res.hasOwnProperty('code')) {
          const code = JSON.parse(JSON.stringify(res));
          if (code.code === 'ER_DUP_ENTRY') {
            resolve(2);
          }
        }
        else {
          resolve(0);
        }
      }, err => {
        resolve(0);
      });
    });
  }

  // AKTYWACJA MINISTRANTA
  async aktywacjaMinistranta(email: string, id_user: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/activate_user', {
        email, id_user, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(1);
        }
        else if (res.hasOwnProperty('code')) {
          const code = JSON.parse(JSON.stringify(res));
          if (code.code === 'ER_DUP_ENTRY') {
            resolve(2);
          }
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

  // AKTUALIZACJA MINISTRANTA
  async aktualizacjaMinistranta(ministrant: User) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/user_update', { stopien: ministrant.stopien, punkty: ministrant.punkty, id_user: ministrant.id_user, admin: ministrant.admin, imie: ministrant.imie, nazwisko: ministrant.nazwisko, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // USUWANIE KONTA MINISTRANTA
  async usunKontoMinistranta(id_user: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_user_account_admin', {
        id_user, id_parafii: this.id_parafii, smart: this.smart,
        jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
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

  // AKTUALIZACJA DANYCH MINISTRANTA
  async aktualizacjaDanychMinistranta(ulica: string, kod_pocztowy: string, miasto: string, telefon: string) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/update_user_data', { ulica, kod_pocztowy, miasto, telefon, id_user: this.id_user, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(this.id_user);
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

  // POBIERANIE DANYCH O MINISTRANCIE
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

  // POBIERANIE DYŻURÓW DLA DANEGO MINISTRANTA
  async pobierzDyzuryDlaMinistranta(id_user: number, stopien: number) {
    return new Promise<Array<Wydarzenie>>(resolve => {

      this.http.post(this.url + '/user_duty', { id_user, stopien, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(JSON.parse(JSON.stringify(null)));
        }
        else {
          resolve(JSON.parse(JSON.stringify(res)));
        }
      });
    });
  }

  // ZMIANA HASŁA
  async zmienHaslo(aktualne_haslo: string, nowe_haslo: string) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/change_password', { aktualne_haslo: sha512.sha512.hmac('mSf', aktualne_haslo), nowe_haslo: sha512.sha512.hmac('mSf', nowe_haslo), id_user: this.id_user, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res === 'zakonczono') {
          resolve(1);
        }
        else if (res === 'niepoprawne') {
          resolve(2);
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

  // USUWANIE KONTA USERA
  async usunKontoUsera(admin: number, haslo: string) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_user_account', {
        id_user: this.id_user, id_parafii: this.id_parafii, admin,
        haslo: sha512.sha512.hmac('mSf', haslo), smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'zakonczono') {
          resolve(1);
        }
        else if (res === 'jeden') {
          resolve(2);
        }
        else if (res === 'niepoprawne') {
          resolve(3);
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

  // POBIERANIE WYDARZEŃ NA DANY DZIEŃ
  async pobierzWydarzeniaNaDanyDzien(dzien: number, data_dokladna: string) {
    return new Promise<Array<Wydarzenie>>(resolve => {

      this.http.post(this.url + '/events', {
        id_parafii: this.id_parafii, dzien, smart: this.smart,
        jwt: this.JWT, data_dokladna
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(null);
          return;
        }
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  // POBIERANIE WSZYSTKICH WYDARZEŃ
  async pobierzWszystkieWydarzenia() {
    return new Promise<Array<Wydarzenie>>(resolve => {

      this.http.post(this.url + '/all_events', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        if (res === 'You have not permission to get the data') {
          resolve(JSON.parse(JSON.stringify(null)));
          return;
        }
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  // WYGENERUJ RAPORT
  async generujRaport(email: string) {
    return new Promise<string>(resolve => {
      this.http.post(this.url + '/raport_pdf', { id_parafii: this.id_parafii, email, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
        resolve(res.toString());
      }, err => {
        console.log(err);
        resolve('');
      });
    });
  }

  // POBIERANIE SPECJALNYCH WYDARZEŃ
  async pobierzSpecjalneWydarzenia() {
    return new Promise<string>(resolve => {
      this.http.post(this.url + '/special_events', {
        id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      },
        { headers: this.headers }).subscribe(res => {
          resolve(JSON.stringify(res));
        }, err => {
          resolve('');
        });
    });
  }

  // DODAWANIE WYDARZENIA
  async dodajNoweWydarzenie(dzien_tygodnia: number, godzina: string, typ: number, grupa: number, nazwa: string, data_dokladna: string) {

    const czas = new Date(godzina);

    return new Promise<number>(resolve => {
      this.http.post(this.url + '/new_event', {
        id_parafii: this.id_parafii, dzien_tygodnia, typ, grupa, nazwa,
        godzina: new Date(2018, 10, 15, czas.getHours() + 1, czas.getMinutes()), data_dokladna, smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res.hasOwnProperty('insertId')) {
          resolve(1);
        }
        else if (res.hasOwnProperty('code')) {
          const code = JSON.parse(JSON.stringify(res));
          if (code.code === 'ER_DUP_ENTRY') {
            resolve(2);
          }
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

  // USUWANIE WYDARZENIA
  async usunWydarzenie(id_wydarzenia: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_event', { id_wydarzenia, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // AKTUALIZACJA WYDARZENIA
  async aktualizacjaWydarzenie(godzina: Date, id_wydarzenia: number, typ: number, grupa: number, nazwa: string, data_dokladna: string) {
    return new Promise<number>(resolve => {
      const czas = new Date(godzina);
      this.http.post(this.url + '/edit_event', {
        godzina: new Date(2018, 10, 15, czas.getHours() + 1, czas.getMinutes()), typ, grupa, nazwa,
        id_wydarzenia, data_dokladna, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
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

  // POBIERANIE DYŻURÓW DO DANEGO WYDARZENIA
  async pobierzDyzuryDoWydarzenia(id_wydarzenia: number) {
    return new Promise<Array<User>>(resolve => {

      this.http.post(this.url + '/event_duty', {
        id_wydarzenia, id_parafii: this.id_parafii,
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

  // USUWANIE DYŻURU
  async usunDyzur(id_user: number, id_wydarzenia: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/delete_duty', { id_user, id_wydarzenia, id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // DODAWANIE DYŻURU
  async dodajDyzur(id_user: number, id_wydarzenia: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/add_duty', {
        id_user, id_wydarzenia,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
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

  // USUWANIE WSZYSTKICH DYŻURÓW
  async usunWszystkieDyzury() {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/reset_duty', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT }, { headers: this.headers }).subscribe(res => {
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

  // POBIERANIE OBECNOSCI DO DANEGO WYDARZENIA
  async pobierzObecnosciDoWydarzenia(id_wydarzenia: number, data: Date) {
    return new Promise<Array<User>>(resolve => {
      const date = data;
      date.setHours(2);

      this.http.post(this.url + '/presence', {
        id_wydarzenia, data: date.toJSON(),
        id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        resolve(JSON.parse(JSON.stringify(res)));
      });
    });
  }

  // AKTUALIZOWANIE ISTNIEJĄCEJ OBECNOŚCI
  async updateObecnosci(obecnosc: Obecnosc, punkty_dod_sluzba: number, punkty_uj_sluzba: number, punkty_dodatkowe: number, punkty_nabozenstwo: number,
    punkty_dod_zbiorka: number, punkty_uj_zbiorka: number, typ_wydarzenia: number) {
    return new Promise<number>(resolve => {
      this.http.post(this.url + '/update_presence', {
        id_obecnosci: obecnosc.id, status: obecnosc.status, punkty_dod_sluzba,
        punkty_uj_sluzba, punkty_dodatkowe, punkty_nabozenstwo, punkty_dod_zbiorka,
        punkty_uj_zbiorka, id_user: obecnosc.id_user, typ_wydarzenia, typ: obecnosc.typ, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        if (res === 'brak') {
          resolve(0);
        }
        else if (res === 'You have not permission to get the data') {
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

  // DODAWANIE NOWEJ OBECNOŚCI
  async nowaObecnosc(obecnosc: Obecnosc, punkty_dod_sluzba: number, punkty_uj_sluzba: number, punkty_dodatkowe: number, punkty_nabozenstwo: number, punkty_dod_zbiorka: number, punkty_uj_zbiorka: number, typ_wydarzenia: number) {
    return new Promise<number>(resolve => {

      this.http.post(this.url + '/add_presence', {
        id_wydarzenia: obecnosc.id_wydarzenia, id_user: obecnosc.id_user,
        data: obecnosc.data, status: obecnosc.status, punkty_dod_sluzba, punkty_uj_sluzba,
        punkty_dodatkowe, punkty_nabozenstwo, punkty_dod_zbiorka,
        punkty_uj_zbiorka, typ: obecnosc.typ, typ_wydarzenia, id_parafii: this.id_parafii,
        smart: this.smart, jwt: this.JWT
      }, { headers: this.headers }).subscribe(res => {
        resolve(1);
      }, err => {
        resolve(0);
      });
    });
  }

}
