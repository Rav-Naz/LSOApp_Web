import { ParafiaService } from './../../services/parafia.service';
import { UiService } from './../../services/ui.service';
import { WiadomosciService } from './../../services/wiadomosci.service';
import { Wiadomosc } from './../../models/wiadomosci.model';
import { sortPolskich } from '../../../assets/sortPolskich';
import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-acolythes-messages',
  templateUrl: './acolythes-messages.component.html',
  styleUrls: ['./acolythes-messages.component.css']
})
export class AcolythesMessagesComponent implements OnInit {

  wiadomosci: Array<Wiadomosc> = [];
  wiadomosciSub: Subscription;
  public dateNow: Date;
  public clock;
  tresc = '';
  public doladowanie = false;
  ostatniaWiadomosc: Wiadomosc;
  ministranci: Array<User> = [];

  miniSub: Subscription;

  sortujPoImieniu = false;

  ladowanie = true;

  limit = 30;

  constructor(private wiadosciService: WiadomosciService, public ui: UiService, private parafiaService: ParafiaService) { }

  @HostListener('scroll', ['$event'])

  ngOnInit(): void {
    this.wiadosciService.pobierzWiadomosci(1, this.limit).then((res) => { });
    this.parafiaService.pobierzMinistrantow().then(res => {
      // this.ui.zmienStan(1,false)
    });

    this.wiadomosciSub = this.wiadosciService.Wiadomosci.subscribe(wiadomosci => {
      this.wiadomosci = [];
      if (wiadomosci === null) {
        return;
      }
      else {
        this.wiadomosci = [...wiadomosci];
        if (this.ostatniaWiadomosc && this.ostatniaWiadomosc.id !== this.wiadomosci[this.wiadomosci.length - 1].id) {
          this.doladowanie = false;

        }
        this.ostatniaWiadomosc = this.wiadomosci[this.wiadomosci.length - 1];
      }
    });

    setTimeout(() => {
      this.miniSub = this.parafiaService.Ministranci.subscribe(lista => {
        this.ministranci = [];
        if (lista !== null) {
          lista.forEach(ministrant => {
            this.ministranci.push({ id_user: ministrant.id_user, id_diecezji: ministrant.id_diecezji, id_parafii: ministrant.id_parafii,
               punkty: ministrant.punkty, stopien: ministrant.stopien, imie: ministrant.imie, nazwisko: ministrant.nazwisko,
                ulica: ministrant.ulica, kod_pocztowy: ministrant.kod_pocztowy, miasto: ministrant.miasto, email: ministrant.email,
                 telefon: ministrant.telefon, aktywny: ministrant.aktywny, admin: ministrant.admin, ranking: ministrant.ranking });
          });
          this.ministranci = this.ministranci.filter(item => item.stopien !== 11);
          this.sortujListe();
          console.log(this.ministranci);
          // this.ui.zmienStan(1,false);
        }
      });
    }, 200);

    this.dateNow = new Date();
    this.clock = setInterval(() => {
      this.dateNow = new Date();
    }, 60000);
  }

  sortujListe() {
    this.ministranci.sort((min1, min2) => {
      if (this.sortujPoImieniu) {
        return sortPolskich(min1.nazwisko, min2.nazwisko);
      }
      else {
        if (min1.punkty < min2.punkty) {
          return 1;
        }
        if (min1.punkty > min2.punkty) {
          return -1;
        }
        return 0;
      }
    });
    setTimeout(() => {

      // this.ui.zmienStan(1, false)

    }, 200);
  }

  async usunWiadomosc(wiadomosc: Wiadomosc) {
    if (wiadomosc.autor_id !== 0) {
      // await this.ui.pokazModalWyboru("Wiadomość zostanie usunięta dla Ciebie i ministrantów.\nCzy chcesz kontynuować?").then((kontynuowac) => {
      // if (kontynuowac) {
      // this.ui.zmienStan(2, true)
      this.tresc = '';
      this.doladowanie = true;
      this.wiadosciService.usunWiadomosc(wiadomosc, this.wiadomosci.length).then(res => {
        if (res === 1) {
          this.ui.showFeedback('succes', 'Usunięto wiadomość', 3);
        }
        else {
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie', 3);
        }
        // this.ui.zmienStan(2, false)
      });
      // }
      // });

    }
    else {
      this.ui.showFeedback('error', 'Nie możesz usunąć wiadomości od ADMINISTRATORA', 3);
    }
  }

  wyslij() {
    // this.ui.zmienStan(2, true)
    // console.log(this.tresc)
    // return
    this.wiadosciService.nowaWiadomosc(this.tresc).then(res => {
      switch (res) {
        case 0:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        case 1:
          this.doladowanie = true;
          this.wiadosciService.pobierzWiadomosci(1, this.wiadomosci.length).then(() => {
            this.tresc = '';
            setTimeout(() => {
              this.ui.showFeedback('succes', 'Wysłano wiadomość', 3);
            }, 100);
          });
          break;
        case 404:
          break;
        default:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
      // this.ui.zmienStan(2, false);
    });
  }

  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * 0.75) && !this.doladowanie) {
      this.doladowanie = true;
      this.wiadosciService.pobierzWiadomosci(1, this.wiadomosci.length + this.limit);
    }
  }
}
