import { HttpService } from './../services/http.service';
import { UiService } from 'src/app/services/ui.service';
import { ParafiaService } from './../services/parafia.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {

  constructor(public userService: UserService, public parafiaService: ParafiaService, private router: Router,
              private ui: UiService, private http: HttpService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.ui.addLoadingEvent();
    }, 10);
    this.userService.pobierzUsera().then(res => {
      this.parafiaService.pobierzParafie().then(res2 => {
        if (this.router.url === '/admin-view') {
          this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
        }
        setTimeout(() => {
          this.ui.removeLoadingEvent();
        }, 10);
      });
    });
    this.parafiaService.pobierzMinistrantow().then(res => {
      setTimeout(() => {
        this.ui.removeLoadingEvent();
      }, 10);
    });
  }

  wyloguj()
  {
    this.ui.addLoadingEvent();
    this.http.wyloguj().then((res) => {
        if (res === 1)
        {

                this.router.navigateByUrl('').then(() => {
                    setTimeout(() => {
                        this.ui.showFeedback('succes', 'Pomyślnie wylogowano', 3);
                        this.ui.removeLoadingEvent();
                    }, 400);
                });
        }
        else
        {
            this.ui.removeLoadingEvent();
            this.ui.showFeedback('error', 'Wystąpił nieoczekiwany błąd', 2);
        }
    });
  }

  wyzerujPunkty() {
    // czy nie jest w szczegolach ministranta
    this.ui.wantToContinue('Czy jesteś pewny, że chcesz wyzerować punkty WSZYSTKIM ministrantom w swojej parafii? Ta funkcja jest zalecana przy rozpoczęciu nowego roku liturgicznego.').then((wybor) => {
      if (wybor) {
        this.ui.addLoadingEvent();
        this.parafiaService.wyzerujPunkty().then(res => {
          this.ui.removeLoadingEvent();
          switch (res) {
            case 0:
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              break;
            case 1:
              this.ui.showFeedback('succes', 'Pomyślnie wyzerowano punkty', 2);
              break;
            default:
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              break;
          }
        });
      }
    });
  }

  usunDyzury() {

    this.ui.wantToContinue('Czy jesteś pewny, że chcesz usunąć WSZYSTKIE dyżury ministrantów w swojej parafii? Ta funkcja jest zalecana przy rozpoczęciu nowego roku liturgicznego.').then((wybor) => {
      if (wybor) {
        this.ui.addLoadingEvent();
        this.parafiaService.usunWszystkieDyzury().then(res => {
          this.ui.removeLoadingEvent();
          switch (res) {
            case 0:
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              break;
            case 1:
              this.ui.showFeedback('succes', 'Pomyślnie usunięto dyżury', 2);
              break;
            default:
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              break;
          }
        });
      }
    });
  }

  generujRaport() {
    new Promise((resolve, reject) => {
      this.ui.showFeedback('loading', 'Trwa przygotowywanie raportu', 10);
      this.http.generujRaport(this.userService.UserEmail).then(res => {
        if (res === 'Wysłano') {
          resolve();
        }
        else {
          this.ui.showFeedback('error', 'Wystąpił nieoczekiwany błąd', 3);
        }
      });

    }).then(() => {
      this.ui.showFeedback('succes', `Raport został wysłany na Twój adres email`, 6);
    });
  }

  openURL(url: string) {
    window.open(url, '_blank');
  }

}
