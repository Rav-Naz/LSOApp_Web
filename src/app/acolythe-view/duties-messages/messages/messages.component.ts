import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wiadomosc } from 'src/app/models/wiadomosci.model';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { HttpService } from 'src/app/services/http.service';
import { WiadomosciService } from 'src/app/services/wiadomosci.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  ladowanieWiadomosci = false;

  wiadomosci: Array<Wiadomosc> = [];
  wiadomosciSub: Subscription;

  doladowanie: boolean = false;
  limit: number = 30;
  ostatniaWiadomosc: Wiadomosc;

  constructor(public userService: UserService, public ui: UiService,
              public http: HttpService, private wiadosciService: WiadomosciService) { }


  ngOnInit(): void {
    this.ladowanieWiadomosci = true;

    this.wiadomosciSub = this.wiadosciService.Wiadomosci.subscribe(wiadomosci => {
      this.wiadomosci = [];
      if (wiadomosci === null) {
        this.ladowanieWiadomosci = false;
        return;
      }
      else {
        this.wiadomosci = [...wiadomosci];
        if (this.ostatniaWiadomosc && this.ostatniaWiadomosc.id !== this.wiadomosci[this.wiadomosci.length - 1].id) {
          this.doladowanie = false;
        }
        this.ostatniaWiadomosc = this.wiadomosci[this.wiadomosci.length - 1];
        this.ladowanieWiadomosci = false;
      }
    });
    this.wiadosciService.pobierzWiadomosci(0, this.limit);
  }

  onScroll(event: any) {
    if ((event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight * 0.75) && !this.doladowanie) {
      this.doladowanie = true;
      this.wiadosciService.pobierzWiadomosci(0, this.wiadomosci.length + this.limit);
    }
  }

  ngOnDestroy()
  {
    this.wiadomosciSub.unsubscribe();
  }
}
