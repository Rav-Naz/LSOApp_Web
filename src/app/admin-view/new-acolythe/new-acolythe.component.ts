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
  zapisz() {

    if ( !this.isEmailValid || !this.isLastNameValid || !this.isNameValid || !this.isRankNotNull || this.zapisywanie) { return; }

    this.zapisywanie = true;

    let rankx = this.ranks.indexOf(this._rank);
    if (rankx === 11) { rankx = 12; }
    if (rankx < 0) { return; }
    this.parafiaService.nowyMinistrant(rankx, this._name, this._lastName,
      this._email === '' || this._email === null ? null : this._email).then(res => {
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
    });
  }

  anuluj()
  {
    this.router.navigateByUrl('/admin-view/(admin:acolythes-messages)');
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }
  get isNameValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń ]{1,20})').test(this._name);
  }
  get isLastNameValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń ]{1,20})').test(this._lastName);
  }
  get isEmailValid()
  {
    return this._email === null || this._email === '' ? true : new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(this._email);
  }
}
