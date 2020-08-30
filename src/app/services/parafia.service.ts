import { Obecnosc } from './../models/obecnosc.model';
import { Parafia } from './../models/parafia.model';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { Wydarzenie } from '../models/wydarzenie.model';

@Injectable({
  providedIn: 'root'
})
export class ParafiaService {

  parafia: Parafia;
  aktualnyMinistrantId: number; // Wykorzystanie: ministranci
  aktualneWydarzenieId: number; // Wykorzystanie: obecnosci

  zapisz = true;

  kalendarzSpecjalne: Array<any>;

  constructor(private http: HttpService) { }

  private ministranciLista: Array<User> = [];

  private ministranci = new BehaviorSubject<Array<User>>(null);
  private dyzuryWydarzenia = new BehaviorSubject<Array<User>>(null);
  private dyzuryMinistranta = new BehaviorSubject<Array<Wydarzenie>>(null);
  private obecnosciWydarzenia = new BehaviorSubject<Array<Obecnosc>>(null);
  private podgladanyMinistrant = new BehaviorSubject<User>(null);
  private parafiaBS = new BehaviorSubject<Parafia>(null);

  get nazwaParafii() {
    return this.parafia ? this.parafia.nazwa_parafii : null;
  }

  get Parafia() {
    return this.parafia;
  }

  get Obecnosci() // Wykorzystanie: obecnosc
  {
    return this.obecnosciWydarzenia.asObservable();
  }

  get Dyzury() { // Wykorzystanie: obecnosc
    return this.dyzuryWydarzenia.asObservable();
  }

  get DyzuryMinistranta() { // Wykorzystanie: ministranci-szczegoly
    return this.dyzuryMinistranta.asObservable();
  }

  get Ministranci() { // Wykorzystanie: ministranci
    return this.ministranci.asObservable();
  }

  get PodgladMinistranta() // Wykorzystanie: ministranci-szczegoly
  {
    return this.podgladanyMinistrant.asObservable();
  }

  get ParafiaObs() {
    return this.parafiaBS.asObservable();
  }

  SetDyzuryMinistranta(list: Array<Wydarzenie>) {
    this.dyzuryMinistranta.next(list);
  }

  SetPodgladMinistranta(user: User) {
    this.podgladanyMinistrant.next(user);
  }

  async pobierzParafie() { // wykorzystanie: acolythes-messages
    return new Promise<number>(resolve => {
      this.http.pobierzParafie().then(async res => {
        if (res === 'blad') {
          resolve(0);
        }
        else if (res === 'jwt') {
          resolve(404);
        }
        else {
          this.parafia = JSON.parse(JSON.stringify(res));
          this.parafiaBS.next(this.parafia);
          resolve(1);
        }
      });
    });
  }

  async aktualizacjaPunktow(punkty_dod_sluzba: number,
    punkty_uj_sluzba: number, punkty_dodatkowe: number,
    punkty_nabozenstwo: number, punkty_dod_zbiorka: number,
    punkty_uj_zbiorka: number) {
    return new Promise<any>(resolve => {
      this.http.aktualizacjaPunktow(punkty_dod_sluzba, punkty_uj_sluzba, punkty_dodatkowe,
        punkty_nabozenstwo, punkty_dod_zbiorka, punkty_uj_zbiorka).then(res => {
          if (res === 1) {
            this.pobierzParafie().then(res => {
              resolve(res);
            });
          }
          else {
            resolve(res);
          }
        });
    });
  }

  async pobierzMinistrantow() { // wykorzystanie: acolythes-messages
    return new Promise<Array<User>>(resolve => {
      this.http.pobierzMinistrantow().then(async res => {
        if (res !== null) {
          this.ministranciLista = res;
          await this.odswiezListeMinistrantow();
          resolve(res);
        }
        else {
          resolve(res);
        }
      });
    });
  }

  WybranyMinistrant(id: number) { // Wykorzystanie: ministranci-szczegoly
    return new Promise<number>((resolve) => {
      this.http.pobierzMinistranta(id).then(res => {
        if (JSON.stringify(res) === '[]') {
          resolve(0);
        }
        else {
          this.podgladanyMinistrant.next(res);
          resolve(1);
        }
      });
    });
  }

  odswiezListeMinistrantow() { // wykorzystanie: acolythes-messages
    return new Promise<void>((resolve) => {
      let lista = new Array<User>();
      lista = this.ministranciLista;
      this.ministranci.next(lista);
      resolve();
    });
  }

  async updateMinistranta(ministrant: User) {
    return new Promise<number>((resolve) => {
      this.http.aktualizacjaMinistranta(ministrant).then(res => {
        if (res === 404) {
          resolve(res);
          return;
        }
        this.pobierzMinistrantow().then(() => {
          resolve(res);
        });
      });
    });
  }

  async usunMinistranta(id_user: number) // Wykorzystanie: ministranci
  {
    return new Promise<number>(resolve => {
      this.http.usunMinistranta(id_user).then(res => {
        if (res === 404) {
          resolve(res);
          return;
        }
        this.pobierzMinistrantow().then(() => {
          resolve(res);
        });
      });
    });
  }

  async usunWszystkieDyzury() {
    return new Promise<number>(resolve => {
      this.http.usunWszystkieDyzury().then(res => {
        if (res === 404) {
          resolve(res);
          return;
        }
        if (this.aktualneWydarzenieId !== null) {
          this.dyzurDoWydarzenia(this.aktualneWydarzenieId, 0).then(ress => {
            resolve(1);
          });
        }
      });
    });
  }

  async nowyMinistrant(stopien: number, imie: string, nazwisko: string, email: string) // Wykorzystanie: ministrant-nowy
  {
    return new Promise<number>(resolve => {
      this.http.nowyMinistrant(stopien, imie, nazwisko, email).then(res => {
        resolve(res);
      });
    });
  }

  async usunKontoMinistanta(id_user: number) {
    return new Promise<number>((resolve) => {
      this.http.usunKontoMinistranta(id_user).then(res => {
        if (res === 404) {
          resolve(404);
          return;
        }
        this.WybranyMinistrant(id_user).then(() => {
          resolve(res);
        });
      });
    });
  }

  async aktualizujParafie(nazwa_parafii: string, id_diecezji: number, miasto: string, id_typu: number) {
    return new Promise<number>(resolve => {
      this.http.aktualizacjaDanychParafii(nazwa_parafii, id_diecezji, miasto, id_typu).then(res => {
        this.pobierzParafie().then(res => {
          resolve(res);
        });
      });
    });
  }

  nowaObecnosc(id_wydarzenia: number, id_user: number, data: Date, start: number, typ: number) // Wykorzystanie: obecnosc
  {
    const ob: Obecnosc = {
      id: 0, id_wydarzenia, id_user,
      data: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours() + 2).toJSON(),
      status: start === 0 ? null : 1, typ
    };
    return ob;
  }

  obecnosciDoWydarzenia(id_wydarzenia: number, data: Date) // Wykorzystanie: obecnosc
  {
    return new Promise<number>((resolve) => {
      this.http.pobierzObecnosciDoWydarzenia(id_wydarzenia, data).then(res => {
        this.obecnosciWydarzenia.next(JSON.parse(JSON.stringify(res)));
        resolve(1);
      });
    });
  }

  async zapiszObecnosci(nowaLista: Array<Obecnosc>, czySprawdzanie: boolean, typ_wydarzenia: number) // Wykorzystanie: obecnosc
  {
    return new Promise<number>((resolve) => {

      nowaLista.forEach(element => {
        if (element.id === 0) {
          this.http.nowaObecnosc(element, this.parafia.punkty_dod_sluzba, this.parafia.punkty_uj_sluzba, this.parafia.punkty_dodatkowe,
            this.parafia.punkty_nabozenstwo, this.parafia.punkty_dod_zbiorka, this.parafia.punkty_uj_zbiorka, typ_wydarzenia);
        }
        else {
          this.http.updateObecnosci(element, this.parafia.punkty_dod_sluzba, this.parafia.punkty_uj_sluzba, this.parafia.punkty_dodatkowe,
            this.parafia.punkty_nabozenstwo, this.parafia.punkty_dod_zbiorka, this.parafia.punkty_uj_zbiorka, typ_wydarzenia);
        }
      });

      setTimeout(() => {
        this.pobierzMinistrantow().then(res => {
          if (res === null) {
            resolve(404);
            return;
          }
          resolve(1);
        });
      }, 500);
    });
  }

  przeszukajKalendarzSpecjalne(dzien: string) {
    const szukane = this.kalendarzSpecjalne.filter(val => val.data_dokladna === dzien);
    return szukane.length === 0 ? null : szukane[0].nazwa;
  }

  async pobierzSpecjalneWydarzenia() {
    return new Promise<any>(resolve => {
      this.http.pobierzSpecjalneWydarzenia().then(async res => {
        if (res !== null) {
          this.kalendarzSpecjalne = JSON.parse(res).map(val => {
            const date = new Date(val.data_dokladna);
            date.setHours(3);
            return { nazwa: val.nazwa, data_dokladna: date.toJSON().slice(0, 10) };
          });
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  }

  wyszukajDyzury(id_user: number) { // Wykorzystanie: ministrant-dyzury, ministranci-szczegoly
    return new Promise<number>(resolve => {
      this.http.pobierzDyzuryDlaMinistranta(id_user, null).then(res => {
        if (res === null) {
          resolve(404);
          return;
        }
        this.dyzuryMinistranta.next(res);
        resolve(1);
      });
    });
  }

  dyzurDoWydarzenia(id_wydarzenia: number, typ?: number) { // Wykorzystanie: obecnosc
    return new Promise<number>((resolve) => {
      if (typ !== undefined && typ !== null && typ === 0) {
        this.http.pobierzDyzuryDoWydarzenia(id_wydarzenia).then(res => {
          if (res === null) {
            resolve(404);
            return;
          }
          this.dyzuryWydarzenia.next(res);
          resolve(1);
        });
      }
      else {
        this.dyzuryWydarzenia.next(this.ministranciLista);
        resolve(1);
      }
    });
  }

  async wyzerujPunkty() {
    return new Promise<number>(resolve => {
      this.http.wyzerujPunkty().then(async res => {
        if (res === 1) {
          this.pobierzMinistrantow().then(res => {
            resolve(1);
          });
        }
        else if (res === 404) {
          resolve(res);
        }
        else {
          resolve(0);
        }
      });
    });
  }

  async zapiszDyzury(nowe: Array<Wydarzenie>, stare: Array<Wydarzenie>) // Wykorzystanie: ministranci-dyzury
  {
    return new Promise<number>(async (resolve) => {
      for (let index = 0; index < 7; index++) {
        if (nowe[index] !== stare[index]) {
          if (nowe[index] === null) {
            await this.usunDyzur(stare[index].id, this.aktualnyMinistrantId);
          }
          else if (stare[index] === null) {
            await this.dodajDyzur(nowe[index].id, this.aktualnyMinistrantId);
          }
          else {
            await this.usunDyzur(stare[index].id, this.aktualnyMinistrantId);
            await this.dodajDyzur(nowe[index].id, this.aktualnyMinistrantId);
          }
        }
      }

      setTimeout(() => {
        this.wyszukajDyzury(this.aktualnyMinistrantId).then(res => {
          if (res === 404) {
            resolve(res);
            return;
          }
          if (this.aktualneWydarzenieId !== null) {
            this.dyzurDoWydarzenia(this.aktualneWydarzenieId, 0).then(res2 => {
              resolve(res2);
            });
          }
        });
      }, 500);
    });
  }

  private usunDyzur(id_wydarzenia: number, id_user: number) { // Wykorzystanie: parafiaService(zapiszDyzury)
    return new Promise<number>((resolve) => {
      this.http.usunDyzur(id_user, id_wydarzenia).then(res => {
        resolve(res);
      });
    });
  }

  private dodajDyzur(id_wydarzenia: number, id_user: number) {// Wykorzystanie: parafiaService(zapiszDyzury)
    return new Promise<number>((resolve) => {
      this.http.dodajDyzur(id_user, id_wydarzenia).then(res => {
        resolve(res);
      });
    });
  }
}
