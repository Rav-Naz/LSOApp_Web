import { WiadomosciService } from './../../services/wiadomosci.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';
import { Wiadomosc } from 'src/app/models/wiadomosci.model';

@Component({
  selector: 'app-duties-messages',
  templateUrl: './duties-messages.component.html',
  styleUrls: ['./duties-messages.component.css']
})
export class DutiesMessagesComponent implements OnInit {

  constructor(public userService: UserService, public ui: UiService,
    public http: HttpService, private wiadosciService: WiadomosciService) { }

  user: User;
  userSub: Subscription;
  dzis = 0;
  teraz: Date;
  dyzury: Array<Wydarzenie> = [];
  dyzurySub: Subscription;
  powiadomieniaSub: Subscription;
  ladowanie = false;
  dni = ['NIE', 'PON', 'WTO', 'ŚR', 'CZW', 'PIA', 'SOB'];
  rzedy: Array<string> = ['1', '2', '3', '4/7', '7', '8', '9'];
  wydarzeniaWgDni: Array<Array<Wydarzenie>> = [[], [], [], [], [], [], []];
  aktualneWydarzenie: Wydarzenie = null;
  pozniejszeWydarzenia: Array<Wydarzenie> = [];

  wiadomosci: Array<Wiadomosc> = [];
  wiadomosciSub: Subscription;

  doladowanie: boolean = false;
  limit: number = 30;
  ostatniaWiadomosc: Wiadomosc;

  ngOnInit(): void {
    this.userSub = this.userService.UserSub.subscribe(user => {
      this.user = user;
      if (this.user === null || this.user === undefined) { return; }
      this.userService.mojeDyzury(this.user.id_user, this.user.stopien).then(res => {
        if (res === 404) {
          this.ui.showFeedback('warning', 'Twoja sesja wygasła. Zaloguj się ponownie aby móc kontynuować', 2);
        }
        setTimeout(() => {
          // this.ladowanie = false;
        }, 500);
      });
    });

    this.dyzurySub = this.userService.UserDyzurySub.subscribe(dyzury => {

      this.teraz = new Date();
      this.teraz.setHours(3);

      if (dyzury !== undefined && dyzury !== null) {

        if (dyzury.length === 0) {
          return;
        }

        this.dyzury = dyzury;

        for (let index = 0; index < this.wydarzeniaWgDni.length; index++) {

          const przedzialPoczatek = new Date();
          const przedzialKoniec = new Date();
          przedzialPoczatek.setFullYear(2018, 10, 15);
          przedzialKoniec.setFullYear(2018, 10, 15);
          przedzialPoczatek.setMinutes(przedzialPoczatek.getMinutes() - 45);
          przedzialKoniec.setMinutes(przedzialKoniec.getMinutes() + 45);

          let dzisiejsze = this.dyzury.filter(dyzur => dyzur.dzien_tygodnia === index);

          dzisiejsze.sort((wyd1, wyd2) => {
            if (wyd1.godzina > wyd2.godzina) { return 1; }
            if (wyd1.godzina < wyd2.godzina) { return -1; }
            return 0;
          });

          if (index === this.teraz.getDay()) {
            const pozniejsze = dzisiejsze.filter(dyzur => new Date(dyzur.godzina) >= przedzialPoczatek);
            if (pozniejsze.length > 0) {
              dzisiejsze = dzisiejsze.slice(0, dzisiejsze.indexOf(pozniejsze[0]));
              this.aktualneWydarzenie = new Date(pozniejsze[0].godzina) <= przedzialKoniec ? pozniejsze.shift() : null;
            }
            this.pozniejszeWydarzenia = pozniejsze.slice(0, 3);
          }

          this.wydarzeniaWgDni[index] = dzisiejsze.slice(0, 3);
        }
      }
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
    this.wiadosciService.pobierzWiadomosci(0, this.limit);
  }

  onScroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * 0.75) && !this.doladowanie) {
      this.doladowanie = true;
      this.wiadosciService.pobierzWiadomosci(0, this.wiadomosci.length + this.limit);
    }
  }

  GodzinaDyzuruNaDanyDzien(godzina: string) {
    return new Date(godzina).toString().slice(16, 21);
  }

  ktoryRzad(index: number) {
    return (index + (10 - this.teraz.getDay()) % 7) % 7;
  }

  opacity(index: number) {
    return 3 / (Math.pow(Math.abs(3 - this.ktoryRzad(index)), 3) + 3);
  }

  wydarzeniaNaDanyDzien(dzien: number) {
    return this.wydarzeniaWgDni[dzien];
  }

}
