import { monasteries, dioceses } from './../../models/lists.model';
import { Parafia } from 'src/app/models/parafia.model';
import { ParafiaService } from './../../services/parafia.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-edit-parish-details',
  templateUrl: './edit-parish-details.component.html',
  styleUrls: ['./edit-parish-details.component.css']
})
export class EditParishDetailsComponent implements OnInit {

  constructor(private router: Router, private parafiaService: ParafiaService, private ui: UiService) { }

  parafiaSub: Subscription;
  parafia: Parafia = {
    id_parafii: 2,
    nazwa_parafii: '',
    id_diecezji: 0,
    miasto: '',
    id_typu: 1,
    punkty_dod_sluzba: 0,
    punkty_uj_sluzba: 0,
    punkty_dodatkowe: 0,
    punkty_nabozenstwo: 0,
    punkty_dod_zbiorka: 0,
    punkty_uj_zbiorka: 0
  };
  public monasteries = monasteries;
  public dioceses = dioceses;
  public zmiana = false;

  ladowanie = false;

  _monastery = 'Wybierz rodzaj';
  _diocese = 'Wybierz diecezję';

  ngOnInit() {
    this.ladowanie = true;
    this.parafiaSub = this.parafiaService.ParafiaObs.subscribe((parish) => {
      if (parish === null || parish === undefined) { return; }
      Object.assign(this.parafia, parish);
      this.changeParishName();
      this._monastery = monasteries[this.parafia.id_typu];
      this._diocese = dioceses[this.parafia.id_diecezji];
      this.lostFocus('1');
      this.lostFocus('2');
      this.ladowanie = false;
    });
  }

  anuluj() {
    this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
  }

  zapisz() {
    this.ladowanie = true;
    const diocese_id = dioceses.indexOf(this._diocese);
    const monastery_id = monasteries.indexOf(this._monastery);
    this.parafiaService.aktualizujParafie(this.parafia.nazwa_parafii, diocese_id, this.parafia.miasto, monastery_id).then(res => {
      if (res === 1) {
        this.zmiana = false;
        setTimeout(() => {
          this.ui.showFeedback('succes', 'Dane zostały zaktualizowane', 3);
        }, 400);
      }
      else {
        this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
        this.ladowanie = true;
      }
      // this.ui.zmienStan(4,false)
    });
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
    }
  }

  changeParishName() {
    if (this.parafia.nazwa_parafii.length > 0) {
      this.setPWColor('#ffffff');
    }
    else {
      this.setPWColor('#7c7c7c');
    }
  }

  setPWColor(color: string) {
    document.getElementById('pw').style.color = color;
  }

  get isMonasteryNotNull() {
    return this._monastery !== 'Wybierz rodzaj';
  }

  get isDioceseNotNull() {
    return this._diocese !== 'Wybierz diecezję';
  }

  get isParish()
  {
    return this.parafia.id_parafii !== 2;
  }

  get isDisabled()
  {
    // return true
    return this.ladowanie || !this.isParish;
  }

}
