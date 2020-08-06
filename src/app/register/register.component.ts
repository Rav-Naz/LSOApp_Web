import { Component, OnInit } from '@angular/core';
import {dioceses, monasteries} from '../models/lists.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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

  constructor() {}

  ngOnInit(): void {
  }

  setPWColor(color: string) {
    document.getElementById('pw').style.color = color;
  }

  changeParishName() {
    if(this._parishName.length > 0) {
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
    let grey = '#7c7c7c';
    let white = '#ffffff';
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

  get isMonasteryNotNull() {
    return this._monastery !== 'Wybierz rodzaj parafii';
  }

  get isDioceseNotNull() {
    return this._diocese !== 'Wybierz diecezję';
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }


}
