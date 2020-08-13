import { WydarzeniaService } from '../../services/wydarzenia.service';
import { ParafiaService } from './../../services/parafia.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { rank } from '../../models/lists.model';
import { Subscription } from 'rxjs';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';
import { User } from 'src/app/models/user.model';
import { Obecnosc } from 'src/app/models/obecnosc.model';
import { DzienTyg } from 'src/app/models/dzien_tygodnia.model';
import { sortPolskich } from 'src/assets/sortPolskich';

@Component({
  selector: 'app-mass',
  templateUrl: './mass.component.html',
  styleUrls: ['./mass.component.css']
})
export class MassComponent implements OnInit, OnDestroy {

  kalendarz = false;
  DyzurySub: Subscription;
  ObecSub: Subscription;
  PROSub: Subscription;
  WydarzeniaSub: Subscription;
  MinistranciSub: Subscription;
  PROLista: Array<string>;
  dzisiejszeWydarzenia: Array<Wydarzenie>;
  wszyscyMinistranci: Array<User> = [];
  wszyscyAktualniMinistranci: Array<User> = [];
  noweObecnosci: Array<Obecnosc>;
  aktywneWydarzenie: Wydarzenie = {
    id: 0, id_parafii: 0, nazwa: 'Msza Święta', typ: 0,
    dzien_tygodnia: 0, godzina: '2018-11-15T21:27:00.000Z', data_dokladna: null, grupa: null
  };
  aktywnyDzien: Date;
  najblizszeWydarzenie: Wydarzenie;
  ministranciDoWydarzenia: Array<User>;
  naglowek: string;
  data: string;
  index = 0;
  dzis: Date;
  cofam: boolean;
  sprawdzane: boolean;
  pokazDodatkowa = false;
  ladowanieDodatkowych = false;
  specjalne: string = null;
  public lista = rank;
  opoznienie = false;
  private odliczenie;
  interval;
  zmiana = false;

  constructor(private parafiaService: ParafiaService, private wydarzeniaService: WydarzeniaService) { }


  ngOnInit(): void {
    this.cofam = false;

    this.dzis = new Date();
    this.interval = setInterval(() => {
      this.dzis = new Date();
    }, 60000);

    this.aktywnyDzien = new Date();
    this.aktywnyDzien.setHours(3);

    this.MinistranciSub = this.parafiaService.Ministranci.subscribe(lista => {
      this.wszyscyMinistranci = [];
      if (lista !== null && lista !== undefined) {
        this.wszyscyMinistranci = Array.from(lista);
      }
    });

    this.parafiaService.pobierzSpecjalneWydarzenia().then(() => {
      this.specjalne = this.parafiaService.przeszukajKalendarzSpecjalne(this.aktywnyDzien.toJSON().slice(0, 10));
      this.wydarzeniaService.dzisiejszeWydarzenia(this.specjalne !== null ? 0 : this.aktywnyDzien.getDay(), this.aktywnyDzien.toJSON());
    });

    this.WydarzeniaSub = this.wydarzeniaService.WydarzeniaObecnoscSub.subscribe(lista => {
      // this.ui.zmienStan(0, true);
      this.dzisiejszeWydarzenia = [];
      this.parafiaService.aktualneWydarzenieId = 0;
      if (lista !== null) {
        this.dzisiejszeWydarzenia = lista.sort((wyd1, wyd2) => {
          if (wyd1.godzina > wyd2.godzina) { return 1; }
          if (wyd1.godzina < wyd2.godzina) { return -1; }
          return 0;
        });
      }

      if (this.dzisiejszeWydarzenia.length === 0) {
        // this.ui.zmienStan(0, false);
        this.zmiana = false;
        this.header(this.aktywnyDzien);
        this.ministranciDoWydarzenia = [];
        this.sprawdzane = false;
        return;
      }

      const zakres = new Date(null, null, null, this.aktywnyDzien.getHours(), this.aktywnyDzien.getMinutes() + 15);

      this.najblizszeWydarzenie = this.dzisiejszeWydarzenia.filter((item) => new Date(item.godzina) >= zakres)[0];

      if (this.najblizszeWydarzenie === undefined || this.cofam) {
        this.index = this.dzisiejszeWydarzenia.length - 1;
        this.aktywneWydarzenie = this.dzisiejszeWydarzenia[this.index];
      }
      else {
        this.index = this.dzisiejszeWydarzenia.indexOf(this.najblizszeWydarzenie);

        if (this.index > 0) {
          this.index -= 1;
        }

        this.aktywneWydarzenie = this.dzisiejszeWydarzenia[this.index];
      }

      this.parafiaService.aktualneWydarzenieId = this.aktywneWydarzenie.id;

      this.header(this.aktywnyDzien, this.aktywneWydarzenie); // Tworzenie nagłówka
      this.odliczenie = setTimeout(async () => {
        this.parafiaService.dyzurDoWydarzenia(this.aktywneWydarzenie.id, this.aktywneWydarzenie.typ); // Pobieranie danych o dyżurach
      }, this.sprawdzane && this.zmiana ? 0 : 500);
    });

    this.DyzurySub = this.parafiaService.Dyzury.subscribe(lista => {
      lista !== [] && lista !== null ? this.ministranciDoWydarzenia = lista : this.ministranciDoWydarzenia = [];
      if ((this.aktywneWydarzenie.typ === 2 && this.aktywneWydarzenie.grupa !== -1) || this.aktywneWydarzenie.typ === 1) {
        this.ministranciDoWydarzenia = this.ministranciDoWydarzenia.filter(min => min.stopien === this.aktywneWydarzenie.grupa);
      }
      this.wszyscyAktualniMinistranci = [...this.wszyscyMinistranci].filter(item => item.stopien !== 11);
      this.ministranciDoWydarzenia.forEach(user => {
        this.wszyscyAktualniMinistranci = this.wszyscyAktualniMinistranci.filter(user2 => user.id_user !== user2.id_user);
      });
      this.parafiaService.obecnosciDoWydarzenia(this.aktywneWydarzenie.id, this.aktywnyDzien);
      this.sortujListe(true);
      this.sortujListe(false);
      this.zmiana = false;
    });

    this.ObecSub = this.parafiaService.Obecnosci.subscribe(lista => {

      this.noweObecnosci = [];

      if (lista === null) {
        this.zmiana = false;
        // this.ui.zmienStan(0, false);
        return;
      }

      if (lista.length > 0) { // W przypadku gdy w bazie sa juz obecnosci dla tego dnia i wydarzenia
        this.sprawdzane = true;
        this.noweObecnosci = lista;
        this.zmiana = false;
      }
      else {// W przypadku gdy sprawdzamy obecnosc w tym dniu pierwszy raz
        this.sprawdzane = false;
        this.ministranciDoWydarzenia.forEach(ministrant => {
          this.noweObecnosci.push(this.parafiaService.nowaObecnosc(this.aktywneWydarzenie.id,
            ministrant.id_user, this.aktywnyDzien, 0, 0));
        });
        if (this.ministranciDoWydarzenia.length === 0 || this.aktywneWydarzenie.typ === 1) {
          this.zmiana = false;
        }
        else {
          this.zmiana = true;
        }
      }
      // this.ui.zmienStan(0, false);

    });
    setTimeout(() => {
      this.opoznienie = true;
    }, 3000);
  }

  header(aktywnyDz: Date, wydarzenie?: Wydarzenie) {

    const dzien: number = aktywnyDz.getDate();
    const miesiac: number = aktywnyDz.getMonth() + 1;

    let dzienStr: string;
    let miesciacStr: string;

    if (wydarzenie) {
      const godzina = new Date(wydarzenie.godzina);
      godzina.setHours(godzina.getHours() + 1);
      this.naglowek = godzina.toJSON().toString().slice(11, 16) + ', ' + (this.specjalne ? 'ŚWI' : DzienTyg[wydarzenie.dzien_tygodnia]) + ' ';
    }
    else {
      this.naglowek = DzienTyg[aktywnyDz.getDay()] + ' ';
    }

    if (dzien < 10) {
      dzienStr = '0' + dzien.toString();
    }
    else {
      dzienStr = dzien.toString();
    }

    if (miesiac < 10) {
      miesciacStr = '0' + miesiac.toString();
    }
    else {
      miesciacStr = miesiac.toString();
    }

    this.data = dzienStr + '/' + miesciacStr;
  }

  sortujListe(gora: boolean) {
    if (gora) {
      this.ministranciDoWydarzenia.sort((min1, min2) => {
        return sortPolskich(min1.nazwisko, min2.nazwisko);
      });
    }
    else {
      this.wszyscyAktualniMinistranci.sort((min1, min2) => {
        return sortPolskich(min1.nazwisko, min2.nazwisko);
      });
    }
  }

  get nazwaWydarzenia() {
    let nazwa = '';
    if (this.specjalne !== null) {
      nazwa = this.specjalne;
    }
    else {
      switch (this.aktywneWydarzenie.typ) {
        case 0 || 1:
          nazwa = this.aktywneWydarzenie.nazwa;
          break;
        case 2:
          if (this.aktywneWydarzenie.grupa === -1) {
            nazwa = 'Zbiórka / Wszyscy';
          }
          else {
            nazwa = 'Zbiórka / ' + rank[this.aktywneWydarzenie.grupa === 12 ? 11 : this.aktywneWydarzenie.grupa];
          }
          break;
        default:
          nazwa = this.aktywneWydarzenie.nazwa;
          break;
      }
    }
    return nazwa;
  }

  ngOnDestroy()
  {
    this.DyzurySub.unsubscribe();
    this.MinistranciSub.unsubscribe();
    this.ObecSub.unsubscribe();
    this.WydarzeniaSub.unsubscribe();
  }

}
