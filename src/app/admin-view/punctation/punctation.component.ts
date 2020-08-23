import { UiService } from './../../services/ui.service';
import { HttpService } from './../../services/http.service';
import { ParafiaService } from './../../services/parafia.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Parafia } from 'src/app/models/parafia.model';

@Component({
  selector: 'app-punctation',
  templateUrl: './punctation.component.html',
  styleUrls: ['./punctation.component.css']
})
export class PunctationComponent implements OnInit {

  zapisywanie = false;

  constructor(private router: Router, private parafiaService: ParafiaService,
    private http: HttpService, private ui: UiService) { }

  pktZaObecnoscSluzba = 0;
  pktZaNieobecnoscSluzba = 0;
  pktZaDodatkowa = 0;
  pktZaObecnoscZbiorka = 0;
  pktZaNieobecnoscZbiorka = 0;
  pktZaNabozenstwo = 0;

  poczObecnoscSluzba = 0;
  poczNieobecnoscSluzba = 0;
  poczDodatkowa = 0;
  poczObecnoscZbiorka = 0;
  poczNieobecnoscZbiorka = 0;
  poczNabozenstwo = 0;

  ngOnInit(): void {
    const o = this.parafiaService.parafia.punkty_dod_sluzba;

    const n = this.parafiaService.parafia.punkty_uj_sluzba;

    const d = this.parafiaService.parafia.punkty_dodatkowe;

    const b = this.parafiaService.parafia.punkty_dod_zbiorka;

    const z = this.parafiaService.parafia.punkty_uj_zbiorka;

    const c = this.parafiaService.parafia.punkty_nabozenstwo;

    this.pktZaObecnoscSluzba = this.poczObecnoscSluzba = o ? o.valueOf() : 0;
    this.pktZaNieobecnoscSluzba = this.poczNieobecnoscSluzba = n ? n.valueOf() : 0;
    this.pktZaDodatkowa = this.poczDodatkowa = d ? d.valueOf() : 0;
    this.pktZaObecnoscZbiorka = this.poczObecnoscZbiorka = b ? b.valueOf() : 0;
    this.pktZaNieobecnoscZbiorka = this.poczNieobecnoscZbiorka = z ? z.valueOf() : 0;
    this.pktZaNabozenstwo = this.poczNabozenstwo = c ? c.valueOf() : 0;
  }

  zapisz() {

    // this.ui.zmienStan(4, true);

    this.zapisywanie = true;

    this.http.aktualizacjaPunktow(this.pktZaObecnoscSluzba, this.pktZaNieobecnoscSluzba, this.pktZaDodatkowa,
      this.pktZaNabozenstwo, this.pktZaObecnoscZbiorka, this.pktZaNieobecnoscZbiorka).then(res => {
        const daneParafii: Parafia = JSON.parse(JSON.stringify(res));
        if (daneParafii.id_parafii) {
          this.parafiaService.parafia = daneParafii;
          // this.ui.zmienStan(4, false);
          setTimeout(() => {
            this.ui.showFeedback('succes', 'Zapisano punktację, zacznie ona obowiązywać od następnego sprawdzenia obecności', 3.5);
          }, 400);
          this.anuluj();
        }
        else {
          // this.ui.zmienStan(4, false);
          this.ui.showFeedback('error', 'Sprawdź swoje połączenie z internetem i spróbuj ponownie ', 3);
          this.zapisywanie = true;
        }
      });
  }

  anuluj() {
    this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
  }

  get czyZmienione() {
    return (this.pktZaNieobecnoscSluzba !== this.poczNieobecnoscSluzba)
      || (this.pktZaObecnoscSluzba !== this.poczObecnoscSluzba)
      || (this.pktZaDodatkowa !== this.poczDodatkowa)
      || (this.pktZaObecnoscZbiorka !== this.poczObecnoscZbiorka)
      || (this.pktZaNieobecnoscZbiorka !== this.poczNieobecnoscZbiorka)
      || (this.pktZaNabozenstwo !== this.poczNabozenstwo)
  }

}
