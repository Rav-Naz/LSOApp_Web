import { Router } from '@angular/router';
import { UiService } from './../../services/ui.service';
import { ParafiaService } from './../../services/parafia.service';
import { rank } from './../../models/lists.model';
import { Component } from '@angular/core';
@Component({
  selector: 'app-new-acolythe',
  templateUrl: './new-acolythe.component.html',
  styleUrls: ['./new-acolythe.component.css']
})
export class NewAcolytheComponent {

  public ranks = rank;

  public _name: string = null;
  public _lastName: string = null;
  public _email: string = null;
  public _rank = 'Wybierz stopień';
  public zapisywanie = false;

  constructor(private parafiaService: ParafiaService, private ui: UiService, private router: Router) { }

  getFocus(name: string) {
    document.getElementById(`selection${name}`).style.color = '#ffffff';
  }

  lostFocus() {
    const grey = '#7c7c7c';
    const white = '#ffffff';
    if (this.isRankNotNull) {
      document.getElementById('selection3').style.color = white;
    } else {
      document.getElementById('selection3').style.color = grey;
    }
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }

  zapisz() {

    this.zapisywanie = true;

    // this.ui.zmienStan(1,true)

    const rankx = this.ranks.indexOf(this._rank);

    this.parafiaService.nowyMinistrant(rankx, this._name, this._lastName, this._email).then(res => {
      switch (res) {
        case 0:
          this.zapisywanie = false;
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
        case 1:
          this.parafiaService.pobierzMinistrantow().then(() => {
            setTimeout(() => {
              this.ui.showFeedback('succes', 'Dodano ministranta ' + this._lastName + ' ' + this._name, 2);
            }, 400);
            this.anuluj();
          });
          break;
        case 2:
          this.zapisywanie = false;
          this.ui.showFeedback('warning', 'Ten e-mail jest już przypisany do innego konta', 3);
          break;
        default:
          this.zapisywanie = false;
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
      // this.ui.zmienStan(1, false);
    });
  }

  anuluj()
  {
    this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
  }
}
