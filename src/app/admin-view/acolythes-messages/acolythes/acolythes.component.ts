import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UiService } from 'src/app/services/ui.service';
import { ParafiaService } from 'src/app/services/parafia.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { sortPolskich } from 'src/assets/sortPolskich';

@Component({
  selector: 'app-acolythes',
  templateUrl: './acolythes.component.html',
  styleUrls: ['./acolythes.component.css']
})
export class AcolythesComponent implements OnInit, OnDestroy {

  ministranci: Array<User> = [];

  miniSub: Subscription;

  sortujPoImieniu = true;

  ladowanieMinistrantow = true;

  limit = 30;

  constructor(public ui: UiService, private parafiaService: ParafiaService,
              private userService: UserService, private router: Router) { }


  ngOnInit()
  {
    this.ladowanieMinistrantow = true;
    this.miniSub = this.parafiaService.Ministranci.subscribe(lista => {
      this.ministranci = [];
      if (lista !== null) {
        this.ministranci = [...lista];
        this.sortujListe();
        this.ladowanieMinistrantow = false;
      }
    });
  }

  sortujListe() {
    this.ministranci.sort((min1, min2) => {
      if (this.sortujPoImieniu) {
        return sortPolskich(min1.nazwisko, min2.nazwisko);
      }
      else {
        if (min1.punkty < min2.punkty) {
          return 1;
        }
        if (min1.punkty > min2.punkty) {
          return -1;
        }
        return 0;
      }
    });
  }

  zmianaSortu() {
    if (this.ladowanieMinistrantow) { return; }

    this.sortujPoImieniu = !this.sortujPoImieniu;
    this.sortujListe();
  }

  nowyMinistrant() {
    if (this.ladowanieMinistrantow) { return; }
    this.router.navigate(['/admin-view', { outlets: { admin: ['new-acolythe'] } }]);
  }

  async usunMinistranta(ministrant: User) {

    // !!!
    if (ministrant.id_user === this.userService.UserID) {
      this.ui.showFeedback('error', 'Nie możesz usunąć swojego konta z poziomu widoku opiekuna', 3);
      return;
    }

    this.ui.wantToContinue('Czy na pewno chcesz usunąć ' + ministrant.nazwisko + ' ' + ministrant.imie + ' z listy ministrantów?').then((kontynuowac) => {
      if (kontynuowac) {
        // this.ui.zmienStan(1,true)
        this.ladowanieMinistrantow = true;
        this.parafiaService.usunMinistranta(ministrant.id_user).then(res => {

          // this.wydarzeniaService.dzisiejszeWydarzenia(this.wydarzeniaService.aktywnyDzien, null)
          setTimeout(() => {
            this.ui.showFeedback('succes', 'Usunięto ministranta ' + ministrant.nazwisko + ' ' + ministrant.imie, 3);
          }, 400);
        });
      }
    });
  }

  szczegolyMinistranta(id: number) {
    this.parafiaService.aktualnyMinistrantId = id;
    this.router.navigateByUrl(`/admin-view/(admin:acolythe-details/${id})`);
  }

  ngOnDestroy()
  {
    this.miniSub.unsubscribe();
  }
}
