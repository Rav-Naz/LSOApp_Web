import { rank } from './../../models/lists.model';
import { ParafiaService } from './../../services/parafia.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';
import { User } from 'src/app/models/user.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-acolythe-details',
  templateUrl: './acolythe-details.component.html',
  styleUrls: ['./acolythe-details.component.css']
})
export class AcolytheDetailsComponent implements OnInit {

  public acolytheId = null;
  zmiana: boolean;
  public _rank = 'Wybierz stopień';
  ranks = rank;
  ministrant: User = {
    id_user: 0, id_diecezji: 0, id_parafii: 0, punkty: 0, stopien: 0,
    imie: "", nazwisko: "", ulica: null, kod_pocztowy: null, miasto: null, email: null,
    telefon: null, aktywny: 0, admin: 0, ranking: 0
  };
  dyzury: Array<Wydarzenie> = [];
  checked: number = 0;
  dyzurSub: Subscription;
  podgladMinistranta: Subscription;

  constructor(private route: ActivatedRoute, private parafiaService: ParafiaService, private location: Location) { }

  ngOnInit(): void {
    this.acolytheId = this.route.snapshot.paramMap.get('id');

    this.parafiaService.WybranyMinistrant(this.acolytheId).then(res => {
      if (res === 0) {
        // this.ui.zmienStan(5,true)
        // this.ui.zmienStan(1,true)
        // setTimeout(() => {
        // this.ui.sesjaWygasla()
        // this.ui.zmienStan(5,false)
        // this.ui.zmienStan(1,false)
        // },1000)
        // this.tabIndexService.nowyOutlet(4, 'ministranci')
        this.location.back();
        return;
      }
    });


    this.podgladMinistranta = this.parafiaService.PodgladMinistranta.subscribe(min => {
      if (min !== undefined && min !== null) {
        this.ministrant = min;
        this._rank = min.stopien === 12 ? this.ranks[11] : this.ranks[min.stopien];
        this.checked = this.ministrant.admin;
      }
    });
  }

  zmienPunkty(punkty: number) {
    this.zmiana = true;
    this.ministrant.punkty += punkty;
  }

  getFocus(name: string) {
    document.getElementById(`selection${name}`).style.color = '#ffffff';
  }

  lostFocus() {
    const grey = '#7c7c7c';
    const white = '#ffffff';
    if (this.isRankNotNull) {
      document.getElementById('selection1').style.color = white;
    } else {
      document.getElementById('selection1').style.color = grey;
    }
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }
}
