import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public _parishName: string = null;
  // public _email: string = null;
  public dioceses = ['białostocka', 'bielsko-żywiecka', 'bydgoska', 'częstochowska', 'drohiczyńska', 'elbląska', 'ełcka', 'gdańska', 'gliwicka', 'gnieźnieńska', 'kaliska', 'katowicka', 'kielecka', 'koszalińsko-kołobrzeska', 'krakowska', 'legnicka', 'lubelska', 'łomżyńska', 'łowicka', 'łódzka', 'opolska', 'Ordynariat Polowy WP', 'pelplińska', 'płocka', 'Polska Misja Katolicka', 'poznańska', 'Prałatura Opus Dei', 'przemyska', 'radomska', 'rzeszowska', 'sandomierska', 'siedlecka', 'sosnowiecka', 'szczecińsko-kamieńska', 'świdnicka', 'tarnowska', 'toruńska', 'warmińska', 'warszawska' ,'warszawsko-praska', 'włocławska', 'wrocławska', 'zamojsko-lubaczowska', 'zielonogórsko-gorzowska'];

  constructor(private location: Location) {}

  ngOnInit(): void {
  }

  backNavigation() {
    this.location.back();
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

  select() {
    console.log('asd');
  }

}
