import { WydarzeniaService } from './../../services/wydarzenia.service';
import { UserService } from './../../services/user.service';
import { HttpService } from './../../services/http.service';
import { UiService } from './../../services/ui.service';
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
  public przypisz = false;
  ranks = rank;
  public userEmail: string = null;
  ministrant: User = {
    id_user: 0, id_diecezji: 0, id_parafii: 0, punkty: 0, stopien: 0,
    imie: '', nazwisko: '', ulica: null, kod_pocztowy: null, miasto: null, email: null,
    telefon: null, aktywny: 0, admin: 0, ranking: 0
  };
  dyzury: Array<Wydarzenie> = [];
  podgladMinistranta: Subscription;


  nazwyDni = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  dni = [false, false, false, false, false, false, false];

  wydarzeniaMinistranta: Array<Wydarzenie>;
  stareWydarzeniaMinistranta: Array<Wydarzenie>;

  wszystkieWydarzenia: Array<Wydarzenie> = [];

  dyzurSub: Subscription;
  wydarzeniaSub: Subscription;

  constructor(private route: ActivatedRoute, private parafiaService: ParafiaService,
    private location: Location, private ui: UiService, private http: HttpService, public userService: UserService,
    private wydarzeniaService: WydarzeniaService) { }

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
      }
    });


    // Wydarzenia
    this.wydarzeniaService.wszystkieWydarzeniaWDyzurach().then(res => {

      this.parafiaService.wyszukajDyzury(this.parafiaService.aktualnyMinistrantId);

      this.wydarzeniaSub = this.wydarzeniaService.WydarzeniaDyzurySub.subscribe(lista => {
        if (lista !== null) {
          this.wszystkieWydarzenia = lista;
        }
      });


      this.dyzurSub = this.parafiaService.DyzuryMinistranta.subscribe(lista_dyzurow => {
        let dyzury: Array<Wydarzenie> = [];
        this.wydarzeniaMinistranta = [null, null, null, null, null, null, null];
        this.stareWydarzeniaMinistranta = [null, null, null, null, null, null, null];
        if (!lista_dyzurow || lista_dyzurow.length === 0) {
          // this.ui.zmienStan(6, false)
          return;
        }
        dyzury = lista_dyzurow;

        for (let index = 0; index < 7; index++) {
          let c = dyzury.filter(dyzur => dyzur.dzien_tygodnia === index)[0];
          if (c !== undefined) {
            this.wydarzeniaMinistranta[index] = c;
            this.stareWydarzeniaMinistranta[index] = c;
            this.dni[index] = true;
          }
        }
        // this.ui.zmienStan(6, false)
      });
    });
  }

  zmienPunkty(punkty: number) {
    this.zmiana = true;
    this.ministrant.punkty += punkty;
  }

  getFocus(name: string) {
    document.getElementById(`selection${name}`).style.color = '#ffffff';
  }

  zapiszEmail() {
    if (this.isEmailsSame) {
      return;
    }

    // this.ui.zmienStan(4,true)

    this.http.aktywacjaMinistranta(this.userEmail, this.acolytheId).then(res => {
      switch (res) {
        case 0:
          // this.ui.zmienStan(4,false)
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;

        case 1:
          this.parafiaService.pobierzMinistrantow().then(() => {
            this.parafiaService.WybranyMinistrant(this.acolytheId);
            // this.ui.zmienStan(4, false)
          });
          break;
        case 2:
          // this.ui.zmienStan(4, false)
          this.ui.showFeedback('warning', 'Ten adres e-mail jest już przypisany do innego konta', 3);
          break;
        default:
          // this.ui.zmienStan(4, false)
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          break;
      }
    });
  }

  usun() {
    // this.ui.pokazModalWyboru("Usuwając dostęp do konta dla ministranta utraci on mozliwość logowania, lecz jego dane pozostaną.\nCzy chcesz kontynuować?").then(wybor => {
    //     if(wybor)
    //     {

    // this.ui.zmienStan(4,true)
    // this.ui.zmienStan(5,false)
    this.parafiaService.usunKontoMinistanta(this.acolytheId).then(res => {
      if (res === 1) {

        setTimeout(() => {
          this.ui.showFeedback('succes', 'Usunięto dostęp do konta', 3);
        }, 400);
        // this.ui.zmienStan(4,false)
        this.powrot();
      }
      else {
        // this.ui.zmienStan(5,false)
        // this.ui.zmienStan(4,false)
        this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
      }
    });
  }
  // })
  // }

  zmianaCheckboxa(index: number, event) {
    this.dni[index] = event;
    if (event === false) {
      this.zmiana = true;
      this.wydarzeniaMinistranta[index] = null;
    }
  }

  wyborGodziny(dzien_tygodnia: number) {
    return this.wszystkieWydarzenia.filter(dzien => dzien.dzien_tygodnia === dzien_tygodnia && dzien.typ === 0).sort((a,b) => {
      if (new Date(a.godzina) < new Date(b.godzina)) {
        return 1;
      }
      if (new Date(a.godzina) > new Date(b.godzina)) {
        return -1;
      }
      return 0;
    });
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

  powrot() {
    // this.tabIndexService.nowyOutlet(4, 'ministrant-szczegoly');
    this.location.back();
  }

  get isEmailsSame() {
    return this.ministrant.email === this.userEmail;
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }
}
