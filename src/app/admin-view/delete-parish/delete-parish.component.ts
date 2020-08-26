import { UiService } from 'src/app/services/ui.service';
import { HttpService } from './../../services/http.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-parish',
  templateUrl: './delete-parish.component.html',
  styleUrls: ['./delete-parish.component.css']
})
export class DeleteParishComponent {

  constructor(private router: Router, private http: HttpService, private ui: UiService) { }

  _password: string;

  anuluj() {
    this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
  }

  usun() {
    this.ui.addLoadingEvent();
    this.http.usuwanieParafii(this._password).then(res => {
      switch (res) {
        case 0:
          this.ui.removeLoadingEvent();
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        case 1:
          this.ui.addLoadingEvent();
          this.http.wyloguj().then((res) => {
            if (res === 1) {

              this.router.navigateByUrl('').then(() => {
                setTimeout(() => {
                  this.ui.showFeedback('succes', 'Konto zostało usunięte pomyślnie. Dziękujemy za skorzystanie z aplikacji :)', 3);
                  this.ui.removeLoadingEvent();
                }, 400);
              });
            }
            else {
              this.ui.removeLoadingEvent();
              this.ui.showFeedback('error', 'Wystąpił nieoczekiwany błąd', 2);
            }
          });
          break;
        case 2:
          this.ui.removeLoadingEvent();
          this.ui.showFeedback('warning', 'Wpisane hasło jest niepoprawne', 3);
          break;
        case 3:
          // this.secureStorage.removeAll().then(() => {
          // setTimeout(() => {
          // this.ui.zmienStan(4, false);
          this.router.navigateByUrl('').then(() => { this.ui.removeLoadingEvent(); });

          // this.router.navigate([''], { clearHistory: true, transition: { name: 'slideBottom' } }).then(() => {
          this.ui.showFeedback('error', 'BŁĄD KRYTYCZNY', 3);
          // });
          // }, 100);
          // });

          break;
        default:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          this.ui.removeLoadingEvent();
          break;
      }
    });

  }

}
