import { rank } from './../../models/lists.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DzienTyg } from '../../models/dzien_tygodnia.model';
import { WydarzeniaService } from 'src/app/services/wydarzenia.service';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit {

  constructor(private router: Router,
              private wydarzeniaService: WydarzeniaService, public ui: UiService) { }

  DzienTygodnia = [0, 1, 2, 3, 4, 5, 6];
  wybranyDzien: number;
  zmiana = false;
  wydarzeniaSub: Subscription;
  wydarzeniaDnia: Array<Wydarzenie>;
  stareWydarzeniaDnia: Array<Wydarzenie>;
  aktualizujWydarzeniaDnia: Array<Wydarzenie>;
  ladowanie = false;

  noweWydGodz: string = null;
  rangi: Array<string> = ['Wszyscy'];
  grupa = 'Wybierz grupę';
  dataDokladna = 'Wybierz datę';
  teraz: Date;
  mozliwe_daty: Array<string> = [];
  nowyTyp: number = null;
  edytowanyIndex: number = null;
  jednorazowe = false;
  edycja = false;

  ngOnInit(): void {
    this.wydarzeniaService.setWydarzeniaEdycja(null);
    this.rangi = this.rangi.concat(rank);
    this.wydarzeniaSub = this.wydarzeniaService.WydarzeniaEdycjaSub.subscribe((lista) => {
      this.wydarzeniaDnia = [];
      this.stareWydarzeniaDnia = [];
      this.aktualizujWydarzeniaDnia = [];

      if (lista === null || lista === undefined) { this.ladowanie = false; return; }
      if (lista.length === 0) { this.ladowanie = false; return; }
      this.wydarzeniaDnia = [...lista];
      this.stareWydarzeniaDnia = [...lista];
      this.sortuj();
      this.ladowanie = false;
    });
  }

  private sortuj() {
    this.wydarzeniaDnia.sort((wyd1, wyd2) => {
      const godzina1 = new Date(wyd1.godzina);
      const godzina2 = new Date(wyd2.godzina);
      if ((godzina1 > godzina2)) { return 1; }
      if ((godzina1 < godzina2)) { return -1; }
      return 0;
    });
  }

  async zmienDzien(dzien: number) {
    if (dzien === this.wybranyDzien) {
      return;
    }
    this.ui.wantToContinue('Zmienione wydarzenia nie zostaną zapisane.', this.zmiana).then((kontynuowac) => {
    if (kontynuowac) {
    // this.ui.zmienStan(3,true);
    this.zmiana = false;
    this.ladowanie = true;
    this.wybranyDzien = dzien;
    this.clear();
    this.stworzMozliweDaty();
    this.wydarzeniaService.wydarzeniaWEdycji(this.wybranyDzien);
    }
    });
  }


  edytujWydarzenie(wyd: Wydarzenie, index: number)
  {
    this.edycja = true;
    this.edytowanyIndex = index;
    this.stworzMozliweDaty();
    this.nowyTyp = wyd.typ;
    this.noweWydGodz = new Date(wyd.godzina).toTimeString().slice(0, 5);
    this.lostFocus('1');
    this.jednorazowe = wyd.data_dokladna ? true : false;
    this.dataDokladna = wyd.data_dokladna;
    this.grupa = wyd.grupa !== null ? this.rangi[wyd.grupa === 12 ? wyd.grupa : wyd.grupa + 1] : null;
    setTimeout(() => {
      if (this.dataDokladna !== null)
      {
        this.lostFocus('3');
      }
      if (this.grupa !== null)
      {
        this.lostFocus('2');
      }
    }, 20);
  }

  dodaj() {
    if (!this.isTypeNotNull || !this.isHourNotNull || (this.jednorazowe ? !this.isDateNotNull
      : false) || (this.nowyTyp === 2 ? !this.isRankNotNull : false)) { return; }
    const splitted = this.noweWydGodz.split(':');
    const rankx = this.rangi.indexOf(this.grupa);
    if (this.edycja) {
      if (this.wydarzeniaDnia.filter(wydarzenie => new Date(wydarzenie.godzina).getHours() === parseInt(splitted[0])
        && new Date(wydarzenie.godzina).getMinutes() === parseInt(splitted[1]) && wydarzenie.id !== this.wydarzeniaDnia[this.edytowanyIndex].id)[0] === undefined) {
        this.wydarzeniaDnia[this.edytowanyIndex].godzina = new Date(2018, 10, 15, parseInt(splitted[0]), parseInt(splitted[1])).toJSON();
        this.wydarzeniaDnia[this.edytowanyIndex].grupa = this.nowyTyp === 2 ? (rankx === null ? -1 : (rankx === 12 ? rankx : rankx - 1)) : null,
        this.wydarzeniaDnia[this.edytowanyIndex].data_dokladna = this.jednorazowe ? this.dataDokladna : null;
        this.aktualizujWydarzeniaDnia.push(this.wydarzeniaDnia[this.edytowanyIndex]);
        this.zmiana = true;
        setTimeout(() => {
          this.sortuj();
          this.clear();
        }, 50);
      }
      else {
        this.ui.showFeedback('warning', 'Wydarzenie o takiej godzinie już istnieje', 3);
      }
    }
    else {
      if (this.wydarzeniaDnia.filter(wydarzenie => new Date(wydarzenie.godzina).getHours() === parseInt(splitted[0])
        && new Date(wydarzenie.godzina).getMinutes() === parseInt(splitted[1]))[0] === undefined) {

        this.wydarzeniaDnia.push({
          id: 0,
          id_parafii: 2,
          nazwa: this.nowyTyp === 0 ? 'Msza Święta' : this.nowyTyp === 1 ? 'Nabożeństwo' : 'Zbiórka',
          typ: this.nowyTyp, dzien_tygodnia: this.wybranyDzien,
          godzina: new Date(2018, 10, 15, parseInt(splitted[0]), parseInt(splitted[1])).toJSON(),
          grupa: this.nowyTyp === 2 ? (rankx === null ? -1 : (rankx === 12 ? rankx : rankx - 1)) : null,
          data_dokladna: this.jednorazowe ? this.dataDokladna : null
        });
        this.zmiana = true;
        setTimeout(() => {
          this.sortuj();
          this.clear();
        }, 50);
      }
      else {
        this.ui.showFeedback('warning', 'Wydarzenie o takiej godzinie już istnieje', 3);
      }
    }
  }

  async usun(wydarzenie: Wydarzenie) {
    this.ui.wantToContinue("Usunięcie wydarzenia spowoduje utratę przypisanych do niego dyżurów.\nCzy chcesz trwale usunąć wydarzenie z godziny " + new Date(wydarzenie.godzina).toString().slice(16, 21) + "?").then((kontynuowac) => {
        if (kontynuowac) {
            this.czyAktualizowane(wydarzenie);
            const index = this.wydarzeniaDnia.indexOf(wydarzenie);
            this.wydarzeniaDnia.splice(index, 1);
            this.zmiana = true;
        }
    });
}

  zapisz() {
    this.zmiana = false;
    this.ladowanie = true;
    this.wydarzeniaService.zapiszWydarzenia(this.stareWydarzeniaDnia, this.wydarzeniaDnia, this.aktualizujWydarzeniaDnia, this.wybranyDzien).then(res => {
        if (res === 1) {
            this.wydarzeniaService.dzisiejszeWydarzenia(this.wydarzeniaService.aktywnyDzien, null);
            this.wydarzeniaService.wydarzeniaWEdycji(this.wybranyDzien).then(() => {
                this.ui.showFeedback('succes', 'Zapisano wydarzenia', 3);
            });
        }
        else {
            this.zmiana = true;
            this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
        }
        // this.ladowanie = false;
    });
}

private czyAktualizowane( wydarzenie: Wydarzenie)
    {
        const czyAktualizowane = this.aktualizujWydarzeniaDnia.filter(item => item.id === wydarzenie.id)[0];
        if (czyAktualizowane !== undefined)
        {
            const index = this.aktualizujWydarzeniaDnia.indexOf(czyAktualizowane);
            this.aktualizujWydarzeniaDnia.splice(index, 1);
        }
    }

  getFocus(name: string) {
    document.getElementById(`selection${name}`).style.color = '#ffffff';
  }

  lostFocus(name: string) {
    const grey = '#7c7c7c';
    const white = '#ffffff';
    switch (name) {
      case '1':
        if (this.isHourNotNull) {
          document.getElementById('selection1').style.color = white;
        } else {
          document.getElementById('selection1').style.color = grey;
        }
        break;
      case '2':
        if (this.isRankNotNull) {
          document.getElementById('selection2').style.color = white;
        } else {
          document.getElementById('selection2').style.color = grey;
        }
        break;

      case '3':
        if (this.isDateNotNull) {
          document.getElementById('selection3').style.color = white;
        } else {
          document.getElementById('selection3').style.color = grey;
        }
        break;
    }
  }

  clear() {
    this.mozliwe_daty = [];
    this.nowyTyp = null;
    this.noweWydGodz = null;
    this.jednorazowe = false;
    this.grupa = 'Wybierz grupę';
    this.dataDokladna = 'Wybierz datę';
    this.edytowanyIndex = null;
    this.edycja = false;
  }

  stworzMozliweDaty() {
    this.mozliwe_daty = [];
    this.teraz = new Date();
    this.teraz.setDate(this.teraz.getDate() + (7 + this.wybranyDzien - this.teraz.getDay()) % 7);
    this.mozliwe_daty.push(this.teraz.toJSON().slice(0, 10));
    for (let index = 0; index < 9; index++) {
      this.teraz.setDate(this.teraz.getDate() + 7);
      this.mozliwe_daty.push(this.teraz.toJSON().slice(0, 10));
    }
  }

  powrot()
  {
    this.ui.wantToContinue('Zmienione wydarzenia nie zostaną zapisane.', this.zmiana).then(decision => {
      if (decision)
      {
        this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
      }
    });
  }

  dzienTygodnia(dzien: number) {
    return DzienTyg[dzien];
  }

  get isRankNotNull() {
    return this.grupa !== 'Wybierz grupę';
  }

  get isHourNotNull() {
    return this.noweWydGodz !== null;
  }

  get isDateNotNull() {
    return this.dataDokladna !== 'Wybierz datę';
  }

  get isTypeNotNull() {
    return this.nowyTyp !== null;
  }
}
