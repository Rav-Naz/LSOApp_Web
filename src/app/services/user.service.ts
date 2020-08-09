import { Wydarzenie } from './../models/wydarzenie.model';
import { Injectable } from '@angular/core';
import {BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Dyzur } from './../models/dyzur.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  public wersja: string = "2.2.0"; //Wykorzystanie: ustawienia-m, ustawienia-o
  private user: User

  userDyzury: Array<Dyzur> = [];
  public opiekun: boolean = undefined;
  private _czyOpiekun = new BehaviorSubject<boolean>(false);
  private userDyzurySub = new BehaviorSubject<Array<Wydarzenie>>(null);
  private userSub = new BehaviorSubject<User>(null);
  private powiadomieniaODyzurach = new BehaviorSubject<boolean>(null);

  get czyOpiekun()
  {
    return this._czyOpiekun.asObservable();
  }

  async zmianaOpiekuna(bool: boolean)
    {
        return new Promise<number>((resolve) => {
            this.opiekun = bool;
            this._czyOpiekun.next(bool);
            setTimeout(() => {
                resolve(1);
            }, 300);
        });
    }

    zmienUsera(user: User)
    {
        this.user = user;
        this.userSub.next(user);
        this.powiadomieniaODyzurach.next(user.powiadomienia === 1 ? true : false);
    }
}
