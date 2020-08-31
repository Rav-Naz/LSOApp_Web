import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { HttpService } from './../services/http.service';
import { UiService } from 'src/app/services/ui.service';
import { ParafiaService } from './../services/parafia.service';
import { UserService } from './../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WindowSize } from '../models/window_size.model';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit, OnDestroy {

  private windowSizeSubscription$: Subscription;
  public windowSize: WindowSize = { height: 1080, width: 1920};

  constructor(public userService: UserService, public parafiaService: ParafiaService, private router: Router,
              private ui: UiService, private http: HttpService, private authService: AuthService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.ui.addLoadingEvent();
    }, 10);
    this.windowSizeSubscription$ = this.ui.windowSizeObs.subscribe(size => {
      this.windowSize = {height: size.currentTarget.innerHeight, width: size.currentTarget.innerWidth};
    });
    this.userService.pobierzUsera().then(res => {
      this.parafiaService.pobierzParafie().then(res2 => {
        if (this.router.url === '/admin-view') {
          this.router.navigateByUrl('/admin-view/(admin:acolythes-messages)');
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

  wyloguj() {
    this.ui.addLoadingEvent();
    this.authService.logout();
  }

  switchAccout()
  {
    this.ui.addLoadingEvent();
    this.router.navigateByUrl('/acolythe-view');
  }

  wyzerujPunkty() {
    if (this.router.url.split('/').slice(0, 3).join('/') === '/admin-view/(admin:acolythe-details') {
      this.ui.showFeedback('warning', 'Aby wykonać tą czynność, opuść zakładkę szczegóły ministranta', 5);
      return;
    }
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
    if (this.router.url.split('/').slice(0, 3).join('/') === '/admin-view/(admin:acolythe-details') {
      this.ui.showFeedback('warning', 'Aby wykonać tą czynność, opuść zakładkę szczegóły ministranta', 5);
      return;
    }
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

  ngOnDestroy()
  {
    this.windowSizeSubscription$.unsubscribe();
  }

}
