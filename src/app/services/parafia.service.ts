import { Obecnosc } from './../models/obecnosc.model';
import { Parafia } from './../models/parafia.model';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../models/user.model';
import { Dyzur } from '../models/dyzur.model';
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

  constructor(private http: HttpService){}

  private ministranciLista: Array<User> = [];

  private _dyzury: Array<Dyzur> = [];

  private ministranci = new BehaviorSubject<Array<User>>(null);
  private dyzuryWydarzenia = new BehaviorSubject<Array<User>>(null);
  private dyzuryMinistranta = new BehaviorSubject<Array<Wydarzenie>>(null);
  private obecnosciWydarzenia =  new BehaviorSubject<Array<Obecnosc>>(null);
  private podgladanyMinistrant =  new BehaviorSubject<User>(null);

  get nazwaParafii() {
    return this.parafia ? this.parafia.nazwa_parafii : null;
}

  async pobierzParafie()
    {
        return new Promise<number>(resolve => {
            this.http.pobierzParafie().then(async res => {
              console.log(res);
              if (res === 'blad')
                {
                    resolve(0);
                }
                else if (res === 'jwt')
                {
                    resolve(404);
                }
                else
                {
                    this.parafia = JSON.parse(JSON.stringify(res));
                    resolve(1);
                }
            });
        });
    }
}
