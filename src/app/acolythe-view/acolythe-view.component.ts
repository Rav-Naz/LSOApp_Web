import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { UiService } from './../services/ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { WindowSize } from '../models/window_size.model';

@Component({
  selector: 'app-acolythe-view',
  templateUrl: './acolythe-view.component.html',
  styleUrls: ['./acolythe-view.component.css']
})
export class AcolytheViewComponent implements OnInit, OnDestroy {

  private windowSizeSubscription$: Subscription;
  public windowSize: WindowSize = { height: 1080, width: 1920};
  user: User;
  userSub: Subscription;
  public miejsce: number;
  public navigationMenu = false;

  constructor(public ui: UiService, public userService: UserService,
              private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.ui.addLoadingEvent();
    }, 10);
    this.windowSize = {height: window.innerHeight, width: window.innerWidth };
    this.windowSizeSubscription$ = this.ui.windowSizeObs.subscribe(size => {
      if (!size) { return; }
      this.windowSize = {height: size.currentTarget.innerHeight, width: size.currentTarget.innerWidth};
    });
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

  wyloguj() {
    this.ui.addLoadingEvent();
    this.authService.logout();
  }

  switchAccount() {
    this.ui.addLoadingEvent();
    this.router.navigateByUrl('/admin-view');
  }

  get UserPoints() {
    return this.user ? this.user.punkty : null;
  }
  get UserRank() {
    return this.miejsce ? this.miejsce.valueOf() : null;
  }

  openURL(url: string) {
    window.open(url, '_blank');
  }

  get isMobile()
  {
    return this.windowSize.width <= 850;
  }

  get isNavigation()
  {
    return this.windowSize.width <= 1200;
  }

  ngOnDestroy()
  {
    this.windowSizeSubscription$.unsubscribe();
  }
}
