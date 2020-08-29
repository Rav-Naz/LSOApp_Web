import { UserService } from 'src/app/services/user.service';
import { UiService } from './../../services/ui.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(private router: Router, private ui: UiService, private userService: UserService) { }

  ladowanie = false;
  _password: string;

  anuluj() {
    this.router.navigateByUrl('/acolythe-view/(acolythe:duties-messages)');
  }

  usun() {
    if (this._password === null || this._password === undefined) { return; }
    this.ladowanie = true;
    this.ui.addLoadingEvent();
    this.userService.usunKonto(this._password).then(res => {
      switch (res) {
        case 1:
          this.router.navigateByUrl('').then(() => {
            setTimeout(() => {
              this.ui.showFeedback('succes', 'Konto zostało usunięte pomyślnie. Dziękujemy za skorzystanie z aplikacji :)', 3);
            }, 100);
          });
          break;
        case 2:
          this.ui.showFeedback('warning', 'Aby usunąć swoje konto musisz nadać prawa administratora innej osobie w Twojej parafii',
            3);
          break;
        case 3:
          this.ui.showFeedback('warning', 'Hasło jest niepoprawne', 3);
          break;
        case 0:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        default:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
      this.ui.removeLoadingEvent();
      this.ladowanie = false;
    });
  }

}
