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

  get WydarzeniaDyzurySub() //Wykorzystanie: ministranci-dyzury
  {
    return this.wydarzeniaDyzury.asObservable();
  }

  get WydarzeniaEdycjaSub() //Wykorzystanie: edytuj-msze
  {
    return this.wydarzeniaEdycja.asObservable();
  }

  dzisiejszeWydarzenia(dzien: number, data_dokladna: string) {//Wykorzystanie: wydarzeniaService (wydarzeniaWEdycji)
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
}
