import { Component, OnInit } from '@angular/core';
import { Wiadomosc } from 'src/app/models/wiadomosci.model';
import { Subscription } from 'rxjs';
import { WiadomosciService } from 'src/app/services/wiadomosci.service';
import { UiService } from 'src/app/services/ui.service';
import { ParafiaService } from 'src/app/services/parafia.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-admin',
  templateUrl: './messages-admin.component.html',
  styleUrls: ['./messages-admin.component.css']
})
export class MessagesAdminComponent implements OnInit {

  public dateNow: Date;
  public clock;

  wiadomosci: Array<Wiadomosc> = [];
  wiadomosciSub: Subscription;
  tresc = '';
  public doladowanie = false;
  ostatniaWiadomosc: Wiadomosc;
  ladowanieWiadomosci = true;

  limit = 30;

  constructor(private wiadosciService: WiadomosciService, public ui: UiService, private parafiaService: ParafiaService,
              private userService: UserService, private router: Router) { }

  ngOnInit(): void {

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

    this.dateNow = new Date();
    this.clock = setInterval(() => {
      this.dateNow = new Date();
    }, 60000);
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


  onScroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * 0.75) && !this.doladowanie) {
      this.doladowanie = true;
      this.wiadosciService.pobierzWiadomosci(1, this.wiadomosci.length + this.limit);
    }
  }

}
