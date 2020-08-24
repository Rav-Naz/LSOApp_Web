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
    // this.ui.zmienStan(4, true)
    return
    this.http.usuwanieParafii(this._password).then(res => {
      switch (res) {
        case 0:
          // this.ui.zmienStan(4, false)
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        case 1:
          // this.secureStorage.removeAll().then(() => {
          this.router.navigateByUrl('');
          // this.router.navigate([''], { clearHistory: true, transition: { name: 'slideBottom' } }).then(() => {
          setTimeout(() => {
            this.ui.showFeedback('succes', 'Konto zostało usunięte pomyślnie. Dziękujemy za skorzystanie z aplikacji :)', 3);
          }, 400);
          // });
          // });

          break;
        case 2:
          // this.ui.zmienStan(4, false);
          this.ui.showFeedback('warning', 'Wpisane hasło jest niepoprawne', 3);
          break;
        case 3:
          // this.secureStorage.removeAll().then(() => {
          // setTimeout(() => {
          // this.ui.zmienStan(4, false);
          this.router.navigateByUrl('');
          // this.router.navigate([''], { clearHistory: true, transition: { name: 'slideBottom' } }).then(() => {
          this.ui.showFeedback('error', 'BŁĄD KRYTYCZNY', 3);
          // });
          // }, 100);
          // });

          break;
        default:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
    });

  }

}
