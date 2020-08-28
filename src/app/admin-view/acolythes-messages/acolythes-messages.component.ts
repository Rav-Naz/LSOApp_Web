import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { ParafiaService } from './../../services/parafia.service';
import { UiService } from './../../services/ui.service';
import { WiadomosciService } from './../../services/wiadomosci.service';
import { Wiadomosc } from './../../models/wiadomosci.model';
import { sortPolskich } from '../../../assets/sortPolskich';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-acolythes-messages',
  templateUrl: './acolythes-messages.component.html',
  styleUrls: ['./acolythes-messages.component.css']
})
export class AcolythesMessagesComponent implements OnInit, OnDestroy {

  wiadomosci: Array<Wiadomosc> = [];
  wiadomosciSub: Subscription;
  public dateNow: Date;
  public clock;
  tresc = '';
  public doladowanie = false;
  ostatniaWiadomosc: Wiadomosc;
  ministranci: Array<User> = [];

  miniSub: Subscription;

  sortujPoImieniu = true;

  ladowanieMinistrantow = true;
  ladowanieWiadomosci = true;

  limit = 30;

  constructor(private wiadosciService: WiadomosciService, public ui: UiService, private parafiaService: ParafiaService,
              private userService: UserService, private router: Router) { }

  @HostListener('scroll', ['$event'])

  ngOnInit(): void {
    this.ladowanieMinistrantow = true;
    this.ladowanieWiadomosci = true;
    this.wiadosciService.pobierzWiadomosci(1, this.limit).then((res) => { });

    this.wiadomosciSub = this.wiadosciService.Wiadomosci.subscribe(wiadomosci => {
      this.wiadomosci = [];
      if (wiadomosci === null) {
        // this.ladowanieWiadomosci = false;
        return;
      }
      else {
        this.wiadomosci = [...wiadomosci];
        if (this.ostatniaWiadomosc && this.ostatniaWiadomosc.id !== this.wiadomosci[this.wiadomosci.length - 1].id) {
          this.doladowanie = false;
        }
        this.ladowanieWiadomosci = false;
        this.ostatniaWiadomosc = this.wiadomosci[this.wiadomosci.length - 1];
      }
    });

    this.miniSub = this.parafiaService.Ministranci.subscribe(lista => {
      this.ministranci = [];
      if (lista !== null) {
        this.ministranci = [...lista].filter(item => item.stopien !== 11);
        this.sortujListe();
        this.ladowanieMinistrantow = false;
      }
    });

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
  }

  zmianaSortu() {
    if (this.ladowanieMinistrantow) { return; }
    // this.ui.zmienStan(1,true)
    this.sortujPoImieniu = !this.sortujPoImieniu;
    this.sortujListe();
  }

  nowyMinistrant() {
    if (this.ladowanieMinistrantow) { return; }
    this.router.navigate(['/admin-view', { outlets: { admin: ['new-acolythe'] } }]);
  }

  async usunWiadomosc(wiadomosc: Wiadomosc) {
    if (wiadomosc.autor_id !== 0) {
      this.ui.wantToContinue('Wiadomość zostanie usunięta dla Ciebie i ministrantów.\nCzy chcesz kontynuować?').then((kontynuowac) => {
        if (kontynuowac) {
          this.tresc = '';
          this.doladowanie = true;
          this.ladowanieWiadomosci = true;
          this.wiadosciService.usunWiadomosc(wiadomosc, this.wiadomosci.length).then(res => {
            if (res === 1) {
              this.ui.showFeedback('succes', 'Usunięto wiadomość', 3);
            }
            else {
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie', 3);
            }
            this.ladowanieWiadomosci = false;
          });
        }
      });

    }
    else {
      this.ui.showFeedback('error', 'Nie możesz usunąć wiadomości od ADMINISTRATORA', 3);
    }
  }

  wyslij() {
    if (this.tresc.length <= 0 || this.ladowanieWiadomosci) { return; }
    this.ladowanieWiadomosci = true;
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
      this.ladowanieWiadomosci = false;
    });
  }

  async usunMinistranta(ministrant: User) {

    // !!!
    if (ministrant.id_user === this.userService.UserID) {
      this.ui.showFeedback('error', 'Nie możesz usunąć swojego konta z poziomu widoku opiekuna', 3);
      return;
    }

    this.ui.wantToContinue('Czy na pewno chcesz usunąć ' + ministrant.nazwisko + ' ' + ministrant.imie + ' z listy ministrantów?').then((kontynuowac) => {
      if (kontynuowac) {
        // this.ui.zmienStan(1,true)
        this.ladowanieMinistrantow = true;
        this.parafiaService.usunMinistranta(ministrant.id_user).then(res => {

          // this.wydarzeniaService.dzisiejszeWydarzenia(this.wydarzeniaService.aktywnyDzien, null)
          setTimeout(() => {
            this.ui.showFeedback('succes', 'Usunięto ministranta ' + ministrant.nazwisko + ' ' + ministrant.imie, 3);
          }, 400);
        });
      }
    });
  }

  szczegolyMinistranta(id: number) {
    this.parafiaService.aktualnyMinistrantId = id;
    this.router.navigateByUrl(`/admin-view/(admin:acolythe-details/${id})`);
  }

  onScroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * 0.75) && !this.doladowanie) {
      this.doladowanie = true;
      this.wiadosciService.pobierzWiadomosci(1, this.wiadomosci.length + this.limit);
    }
  }

  ngOnDestroy(): void {
    this.miniSub.unsubscribe();
    this.wiadomosciSub.unsubscribe();
  }
}
