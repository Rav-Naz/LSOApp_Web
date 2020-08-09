import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as sha512 from 'js-sha512';

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
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
  });

  nadajId_Parafii(id_parafii: number)
  {
    this.id_parafii = id_parafii;
    localStorage.setItem('id_parafii', id_parafii.toString());
  }

  nadajId_User(id_user: number)
  {
    this.id_user = id_user;
    localStorage.setItem('id_user', id_user.toString());
  }

  nadajJWT(JWT: string)
  {
    this.JWT = JWT;
    localStorage.setItem('JWT', JWT.toString());
  }

  constructor(private http: HttpClient) {
    const id_par = parseInt(localStorage.getItem('id_parafii'));
    const id_use = parseInt(localStorage.getItem('id_user'));
    const JWT = localStorage.getItem('JWT');
    if ( id_par !== null ) {
      this.id_parafii = id_par;
    }
    if ( id_use !== null ) {
      this.id_user = id_use;
    }
    if ( JWT !== null ) {
      this.JWT = JWT;
    }
  }

  ////////////////// ZAPYTANIA BEZ JWT //////////////////

    //LOGOWANIE
    async logowanie(email: string, haslo: string) {
      return new Promise<string>(resolve => {
          this.http.post(this.url + '/login',
          { email: email, haslo: sha512.sha512.hmac('mSf', haslo), smart: this.smart, urzadzenie_id: null, os: this.os },
           { headers: this.headers }).subscribe(res => {
              if(res === 'nieaktywne')
              {
                  resolve('nieaktywne');
              }
              else if(res === 'brak')
              {
                  resolve('brak');
              }
              else if(res === 'niepoprawne')
              {
                  resolve('niepoprawne');
              }
              else if(res[0].hasOwnProperty('id_parafii'))
              {
                  this.nadajJWT(res[1]);
                  this.nadajId_User(res[0].id_user);
                  this.nadajId_Parafii(res[0].id_parafii);
                  resolve(JSON.parse(JSON.stringify(res[0])));
              }
              else
              {
                  resolve('blad');
              }
          }, err => {
              resolve('blad');
          });
      });
  }

  ////////////////// ZAPYTANIA Z JWT //////////////////

  //POBIERANIE DANCYH PARAFII
  async pobierzParafie() {
    return new Promise<string>(resolve => {

        this.http.post(this.url + '/parish', { id_parafii: this.id_parafii, smart: this.smart, jwt: this.JWT },
        { headers: this.headers }).subscribe(res => {
            if (res.hasOwnProperty('id_parafii'))
            {
                resolve(JSON.parse(JSON.stringify(res)));
            }
            else if (res === 'You have not permission to get the data')
            {
                resolve('jwt');
            }
            else
            {
                resolve('blad');
            }
        }, err => {
            resolve('blad');
        });
    });
}
}
