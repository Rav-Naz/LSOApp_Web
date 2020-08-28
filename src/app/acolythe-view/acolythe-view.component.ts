import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { UiService } from './../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-acolythe-view',
  templateUrl: './acolythe-view.component.html',
  styleUrls: ['./acolythe-view.component.css']
})
export class AcolytheViewComponent implements OnInit {

  constructor(private ui: UiService, public userService: UserService, private router: Router) { }

  user: User;
  userSub: Subscription;
  public miejsce: number;

  ngOnInit(): void {
    setTimeout(() => {
      this.ui.addLoadingEvent();
    }, 10);
    this.userSub = this.userService.UserSub.subscribe(user => {
      this.user = user;
      this.userService.miejsceWRankignu().then(res => {
        this.miejsce = res;
        this.ui.removeLoadingEvent();
      });
    });
    this.userService.pobierzUsera().then(res => {
      if (this.router.url === '/acolythe-view') {
        this.router.navigateByUrl('/acolythe-view/(acolythe:duties-messages)');
      }
      this.ui.removeLoadingEvent();
    });

  }

  get UserPoints()
  {
    return this.user ? this.user.punkty : null;
  }
  get UserRank()
  {
    return this.miejsce ? this.miejsce.valueOf() : null;
  }

  openURL(url: string) {
    window.open(url, '_blank');
  }

}
