import { WydarzeniaService } from './../../services/wydarzenia.service';
import { UserService } from './../../services/user.service';
import { HttpService } from './../../services/http.service';
import { UiService } from './../../services/ui.service';
import { rank } from './../../models/lists.model';
import { ParafiaService } from './../../services/parafia.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Wydarzenie } from 'src/app/models/wydarzenie.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-acolythe-details',
  templateUrl: './acolythe-details.component.html',
  styleUrls: ['./acolythe-details.component.css']
})
export class AcolytheDetailsComponent implements OnInit, OnDestroy {

  public acolytheId = null;
  zmiana: boolean = false;
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

  wydarzeniaMinistranta: Array<Wydarzenie> = [null, null, null, null, null, null, null];
  stareWydarzeniaMinistranta: Array<Wydarzenie> = [null, null, null, null, null, null, null];

  wszystkieWydarzenia: Array<Wydarzenie> = [];

  dyzurSub: Subscription;
  wydarzeniaSub: Subscription;

  constructor(private route: ActivatedRoute, private parafiaService: ParafiaService,
    private router: Router, private ui: UiService, private http: HttpService, public userService: UserService,
    private wydarzeniaService: WydarzeniaService) { }

  ngOnInit(): void {
    this.parafiaService.SetDyzuryMinistranta(null);
    this.parafiaService.SetPodgladMinistranta(null);
    this.acolytheId = this.route.snapshot.paramMap.get('id');
    this.parafiaService.aktualnyMinistrantId = this.acolytheId;
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
        this.powrot();
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
      this.parafiaService.wyszukajDyzury(this.acolytheId);

      this.wydarzeniaSub = this.wydarzeniaService.WydarzeniaDyzurySub.subscribe(lista => {
        if (lista !== null) {
          this.wszystkieWydarzenia = lista;
        }
        // console.log(this.wydarzeniaMinistranta, this.dni)
      });


      this.dyzurSub = this.parafiaService.DyzuryMinistranta.subscribe(lista_dyzurow => {
        let dyzury: Array<Wydarzenie> = [];
        this.dni = [false, false, false, false, false, false, false];
        this.wydarzeniaMinistranta = [null, null, null, null, null, null, null];
        this.stareWydarzeniaMinistranta = [null, null, null, null, null, null, null];
        if (!lista_dyzurow || lista_dyzurow.length === 0) {
          // this.ui.zmienStan(6, false)
          return;
        }
        dyzury = lista_dyzurow;

        for (let index = 0; index < 7; index++) {
          const c = dyzury.filter(dyzur => dyzur.dzien_tygodnia === index)[0];
          if (c !== undefined) {
            this.wydarzeniaMinistranta[index] = c;
            this.stareWydarzeniaMinistranta[index] = c;
            this.dni[index] = true;

            const h = this.godzina(index);
            // console.log(this.wydarzeniaMinistranta)
            if (h !== '--:--') {
              const eventIndex = this.wyborGodziny(index).indexOf(this.wszystkieWydarzenia.filter(wyd =>
                wyd.dzien_tygodnia === index && new Date(wyd.godzina).toString().slice(16, 21) === h)[0]);

              this.setSelectionOption(index, eventIndex);
            }
          }
          else {
            this.setSelectionOption(index, 0);
          }
        }
        // console.log(this.wydarzeniaMinistranta)
        // this.ui.zmienStan(6, false)
      });
    });
  }

  zmienPunkty(punkty: number) {
    this.zmiana = true;
    this.ministrant.punkty += punkty;
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
    if (event === null) {
      this.zmiana = true;
      this.wydarzeniaMinistranta[index] = null;
      this.setSelectionOption(index, 0);
    }
  }

  wyborGodziny(dzien_tygodnia: number) {
    return this.wszystkieWydarzenia.filter(dzien => dzien.dzien_tygodnia === dzien_tygodnia && dzien.typ === 0).sort((a, b) => {
      if (new Date(a.godzina) > new Date(b.godzina)) {
        return 1;
      }
      if (new Date(a.godzina) < new Date(b.godzina)) {
        return -1;
      }
      return 0;
    });
  }

  godzina(index: number) {
    if (this.wydarzeniaMinistranta[index] === null) {
      return '--:--';
    }
    else {
      return new Date(this.wydarzeniaMinistranta[index].godzina).toString().slice(16, 21);
    }
  }

  setSelectionOption(id: number, optionId: number) {
    const x = document.getElementById(`selection${id}`) as HTMLSelectElement;
    setTimeout(() => {
      x.options.selectedIndex = optionId;
    }, 10);
  }

  getSelectionOptionId(id: number) {
    const x = document.getElementById(`selection${id}`) as HTMLSelectElement;
    return x.options.selectedIndex;
  }

  chooseEvent(index: number) {
    this.zmiana = true;
    this.wydarzeniaMinistranta[index] = this.wyborGodziny(index)[this.getSelectionOptionId(index)];
  }

  getFocus() {
    document.getElementById(`selectionx`).style.color = '#ffffff';
  }

  lostFocus() {
    const grey = '#7c7c7c';
    const white = '#ffffff';

    if (this.isRankNotNull) {
      document.getElementById('selectionx').style.color = white;
    } else {
      document.getElementById('selectionx').style.color = grey;
    }
  }

  zapisz() {
    // if (this.isRankNotNull)
    // {
    //   return;
    // }
    let rankx = this.ranks.indexOf(this._rank);
    if (rankx === 11) { rankx = 12; }
    if (rankx < 0) { return; }
    this.ministrant.stopien = rankx;
    this.parafiaService.updateMinistranta(this.ministrant).then(res => {
      if (res === 1) {
        this.parafiaService.zapiszDyzury(this.wydarzeniaMinistranta, this.stareWydarzeniaMinistranta).then(res => {
          if (res === 1) {
            setTimeout(() => {
              this.ui.showFeedback('succes', 'Zapisano dyżury', 2);
            }, 400);
            // this.ui.zmienStan(5,false)
            // this.ui.zmienStan(4,false)
            this.zmiana = false;
          }
          else {
            // this.ui.zmienStan(4,false)
            // this.ui.zmienStan(5,false)
            this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          }
        });

      }
      else {
        this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
        this.zmiana = true;
      }

    });
    // this.ui.zmienStan(5, true);
    // this.ui.zmienStan(4, true);
  }

  powrot() {
    // this.tabIndexService.nowyOutlet(4, 'ministrant-szczegoly');
    this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
  }

  get isEmailsSame() {
    return this.ministrant.email === this.userEmail;
  }

  get isRankNotNull() {
    return this._rank !== 'Wybierz stopień';
  }

  ngOnDestroy(): void {
    this.podgladMinistranta.unsubscribe();
    this.dyzurSub.unsubscribe();
    this.wydarzeniaSub.unsubscribe();
  }
}
