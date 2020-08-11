import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Wiadomosc } from '../models/wiadomosci.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WiadomosciService {

  private wiadomosci = new BehaviorSubject<Array<Wiadomosc>>(null);

  constructor(private http: HttpService) { }

  get Wiadomosci() //Wykorzystanie: wiadomosci-m, wiadomosci-o
  {
    return this.wiadomosci.asObservable();
  }

  async pobierzWiadomosci(do_opiekuna: number, limit: number)// Wykorzystanie: wiadomosci-m, wiadomosci-o
  {
    return new Promise<Array<Wiadomosc>>(resolve => {
      this.http.pobierzWidaomosci(do_opiekuna, limit).then(res => {
        this.wiadomosci.next(res);
        resolve();
      });
    });
  }

  async usunWiadomosc(wiadomosc: Wiadomosc, limit: number) {
    return new Promise<number>(resolve => {
      this.http.usunWiadomosc(wiadomosc.id).then(async res => {

        if (res === 1) {
          await this.pobierzWiadomosci(1, limit).then(() => {
            resolve(1);
          });
        }
        else if (res === 404) {
          resolve(404);
        }
        else {
          resolve(0);
        }
      });
    });
  }

  async nowaWiadomosc(tresc: string)
  {
    return new Promise<number>(resolve => {
      this.http.wyslijWidaomosc(tresc).then(res => {
        resolve(res)
      })

    })
  }
}
