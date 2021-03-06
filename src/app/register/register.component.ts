import { HttpService } from './../services/http.service';
import { UiService } from './../services/ui.service';
import { Component } from '@angular/core';
import {dioceses, monasteries} from '../models/lists.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public ranks = ['Ceremoniarz', 'Szafarz', 'Ksiądz', 'Opiekun'];
  public dioceses = dioceses;
  public monasteries = monasteries;

  public _parishName: string = null;
  public _diocese = 'Wybierz diecezję';
  public _monastery = 'Wybierz rodzaj parafii';
  public _rank = 'Wybierz stopień';
  public _city: string = null;
  public _name: string = null;
  public _lastName: string = null;
  public _email: string = null;
  public _terms = false;
  public udanaRejP = false;
  public ladowanie = false;

  constructor(private ui: UiService, private httpService: HttpService) {}

  setPWColor(color: string) {
    document.getElementById('pw').style.color = color;
  }

  changeParishName() {
    if (this._parishName.length > 0) {
      this.setPWColor('#ffffff');
    }
    else{
      this.setPWColor('#7c7c7c');
    }
  }

  getFocus(name: string) {
    document.getElementById(`selection${name}`).style.color = '#ffffff';
  }

  lostFocus(name: string) {
    const grey = '#7c7c7c';
    const white = '#ffffff';
    switch (name) {
      case '1':
        if (this.isMonasteryNotNull) {
          document.getElementById('selection1').style.color = white;
        } else {
          document.getElementById('selection1').style.color = grey;
        }
        break;
      case '2':
        if (this.isDioceseNotNull) {
          document.getElementById('selection2').style.color = white;
        } else {
          document.getElementById('selection2').style.color = grey;
        }
        break;

      case '3':
        if (this.isRankNotNull) {
          document.getElementById('selection3').style.color = white;
        } else {
          document.getElementById('selection3').style.color = grey;
        }
        break;
    }
  }

  zarejestruj()
  {
    const diocese_id = dioceses.indexOf(this._diocese);
    const monastery_id = monasteries.indexOf(this._monastery);
    const rankx = this.ranks.indexOf(this._rank) + 9;
    if (
      !this.isParishNameValid ||
      !this.isMonasteryNotNull ||
      !this.isDioceseNotNull ||
      !this.isCityValid ||
      !this.isNameValid ||
      !this.isLastNameValid ||
      !this.isEmailValid ||
      !this.isRankNotNull ||
      !this.isTermsAccepted) { return; }

    this.ladowanie = true;
    this.httpService.rejestracja(this._parishName, diocese_id, this._city,
      monastery_id, rankx, this._name, this._lastName, this._email/*, this._hasloP*/).then((res) => {
      switch (res) {
          case 0:
              this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              this.ladowanie = false;
              break;

          case 1:
              this.udanaRejP = true;
              this.ladowanie = false;
              break;

          case 2:
              this.ui.showFeedback('warning', 'Ten adres e-mail jest już przypisany do innego konta!', 3);
              this.ladowanie = false;
              break;
          case 3:
              this.ui.showFeedback('warning', 'Ten adres e-mail jest już przypisany do innego konta, które jeszcze nie zostało aktywowane. Aby ponownie wysłać kod aktywacji przejdź do widoku logowanie -> "ZAPOMNIAŁEM HASŁA"', 8);
              this.ladowanie = false;
              break;
          default:
              this.ui.showFeedback('error','Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
              this.ladowanie = false;
              break;
      }
  });
  }

  get isMonasteryNotNull() {
    return this._monastery !== 'Wybierz rodzaj parafii';
  }

  get isDioceseNotNull() {
    return this._diocese !== 'Wybierz diecezję';
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }

  get isTermsAccepted() {
    return this._terms;
  }

  get isParishNameValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń .-]{2,30})').test(this._parishName);
  }

  get isCityValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń .-]{2,30})').test(this._city);
  }

  get isNameValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń -]{1,20})').test(this._name);
  }

  get isLastNameValid()
  {
    return new RegExp('([A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń -]{1,20})').test(this._lastName);
  }

  get isEmailValid()
  {
    return new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').test(this._email);
  }

  changeCheckbox(event)
  {
    this._terms = event;
  }

  openTerms()
  {
    window.open('https://lsoapp.pl/polityka-prywatnosci/', '_blank');
  }
}
