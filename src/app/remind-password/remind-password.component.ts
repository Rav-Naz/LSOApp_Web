import { Router } from '@angular/router';
import { UiService } from './../services/ui.service';
import { HttpService } from './../services/http.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.css']
})
export class RemindPasswordComponent {
  public ladowanie = false;

  constructor(private httpService: HttpService, private ui: UiService, private router: Router) { }

  _email: string;

  wyslij() {
    this.ladowanie = true;

    this.httpService.przypomnij(this._email).then(res => {
        this.ladowanie = false;
        if (res === 1)
        {
            this.router.navigateByUrl('login');
            setTimeout(() => {
                    this.ui.showFeedback('succes', 'Kod do zmiany hasła został wysłany na adres e-mail: ' + this._email, 3);
                }, 200);
        }
        else
        {
            this.ui.showFeedback('warning', 'Brak konta z przypisanym danym adresem e-mail', 3);
            return;
        }
    });

}
}
