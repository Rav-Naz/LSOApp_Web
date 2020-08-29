import { UserService } from 'src/app/services/user.service';
import { UiService } from './../../services/ui.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  _currentPassword: string;
  _newPassword: string;
  _newPasswordRepeat: string;

  ladowanie = false;

  constructor(private router: Router, private ui: UiService,
    private userService: UserService) { }

  get isDisabled() {
    return this.ladowanie;
  }

  anuluj() {
    this.router.navigateByUrl('/acolythe-view/(acolythe:duties-messages)');
  }

  zapisz() {
    this.ladowanie = true;
    this.userService.zmienHaslo(this._currentPassword, this._newPassword).then(res => {
      switch (res) {
        case 1:
          this.anuluj();
          setTimeout(() => {
            this.ui.showFeedback('succes', 'Hasło zostało zmienione', 3);
          }, 400);
          break;
        case 2:
          this.ui.showFeedback('warning', 'Aktualne hasło nie jest poprawne', 3);
          break;
        case 0:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        default:
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
      this.ladowanie = false;
    });
  }

  get isPasswordSame() {
    return this._newPasswordRepeat === this._newPassword;
  }


}
