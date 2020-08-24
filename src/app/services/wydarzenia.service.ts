import { Injectable } from '@angular/core';
import { Wydarzenie } from '../models/wydarzenie.model';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WydarzeniaService {

  constructor(private http: HttpService) { }

  aktywnyDzien: number;

  _wydarzenia: Array<Wydarzenie> = [];

  wydarzeniaDyzury = new BehaviorSubject<Array<Wydarzenie>>(null);
  wydarzeniaObecnosc = new BehaviorSubject<Array<Wydarzenie>>(null);
  wydarzeniaEdycja = new BehaviorSubject<Array<Wydarzenie>>(null);

  get WydarzeniaObecnoscSub() {
    return this.wydarzeniaObecnosc.asObservable();
  }

  get WydarzeniaDyzurySub() // Wykorzystanie: ministranci-dyzury
  {
    return this.wydarzeniaDyzury.asObservable();
  }

  get WydarzeniaEdycjaSub() // Wykorzystanie: edytuj-msze
  {
    return this.wydarzeniaEdycja.asObservable();
  }

  dzisiejszeWydarzenia(dzien: number, data_dokladna: string) {// Wykorzystanie: wydarzeniaService (wydarzeniaWEdycji)
    return new Promise<number>((resolve) => {
      this.aktywnyDzien = dzien;
      this.http.pobierzWydarzeniaNaDanyDzien(dzien, data_dokladna === null ? null : data_dokladna.toString().slice(0, 10)).then(res => {
        if (res === null) {
          resolve(404);
          return;
        }
        this.wydarzeniaObecnosc.next(res);
        resolve(1);
      });
    });
  }

  wydarzeniaWEdycji(dzien_tygodnia: number) // Wykorzystanie: edytuj-msze, wydarzeniaService(zapiszWydarzenia)
  {
    return new Promise<number>((resolve) => {
      this.http.pobierzWydarzeniaNaDanyDzien(dzien_tygodnia, null).then(res => {
        if (res === null) {
          resolve(404);
          return;
        }
        this.wydarzeniaEdycja.next(res);
        resolve(1);
      });
    });
  }

  async zapiszWydarzenia(staraLista: Array<Wydarzenie>, nowaLista: Array<Wydarzenie>, edytowanaLista: Array<Wydarzenie>, dzien_tygodnia: number) //Wykorzystanie: edutyj-msze
  {
    return new Promise<number>((resolve) => {
      return new Promise<number>((resolve1) => {
        let i = 0;
        staraLista.forEach(stary => {
          i++;
          if (nowaLista.filter(nowy => stary.id === nowy.id)[0] === undefined) {
            this.usunWydarzenie(stary).then(res => {
              if (res === 0 || res === 404) {
                resolve(404);
              }
            });
          }
        });
        if (i === staraLista.length) {
          resolve1(1);
        }
      }).then(() => {
        return new Promise<number>((resolve1) => {
          let i = 0;
          nowaLista.forEach(async nowy => {
            i++;
            if (staraLista.filter(stary => nowy.id === stary.id)[0] === undefined) {
              this.dodajWydarzenie(nowy).then(res => {
                if (res === 0 || res === 404) {
                  resolve(404);
                }
              });
            }
          });
          if (i === nowaLista.length) {
            resolve1(1);
          }
        });
      }).then(() => {
        return new Promise<number>((resolve1) => {
          let i = 0;
          edytowanaLista.forEach(async edit => {
            i++;
            this.http.aktualizacjaWydarzenie(new Date(edit.godzina), edit.id, edit.typ, edit.grupa, edit.nazwa, edit.data_dokladna).then(res => {
              if (res === 0 || res === 404) {
                resolve(404);
              }
            });
          });
          if (i === edytowanaLista.length) {
            resolve1(1);
          }
        });
      }).then(() => {
        setTimeout(() => {
          resolve(1);
        }, 500);
      });
    });
  }

  private async usunWydarzenie(wydarzenie: Wydarzenie) //Wykorzystanie: wydarzeniaService(zapiszWydarzenia)
  {
    return new Promise<number>((resolve) => {
      this.http.usunWydarzenie(wydarzenie.id).then(res => {
        resolve(res);
      });
    });
  }

  private async dodajWydarzenie(wydarzenie: Wydarzenie) //Wykorzystanie: wydarzeniaService(zapiszWydarzenia)
  {
    return new Promise<number>((resolve) => {
      this.http.dodajNoweWydarzenie(wydarzenie.dzien_tygodnia, wydarzenie.godzina, wydarzenie.typ, wydarzenie.grupa, wydarzenie.nazwa, wydarzenie.data_dokladna).then(res => {
        resolve(res);
      });

    });
  }

  wszystkieWydarzeniaWDyzurach() {
    return new Promise<number>((resolve) => {
      this.http.pobierzWszystkieWydarzenia().then(res => {
        if (res === null) {
          resolve(404);
        }
        this.wydarzeniaDyzury.next(res);
        resolve(1);
      });
    });
  }
}
