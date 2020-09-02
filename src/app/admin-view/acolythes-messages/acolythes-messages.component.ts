import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowSize } from 'src/app/models/window_size.model';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-acolythes-messages',
  templateUrl: './acolythes-messages.component.html',
  styleUrls: ['./acolythes-messages.component.css']
})
export class AcolythesMessagesComponent implements OnInit, OnDestroy{

  windowSizeSubscription$: Subscription;
  windowSize: WindowSize;

  constructor(public ui: UiService) {}

  ngOnInit()
  {
    this.windowSize = {height: window.innerHeight, width: window.innerWidth };
    this.windowSizeSubscription$ = this.ui.windowSizeObs.subscribe(size => {
      if (!size) { return; }
      this.windowSize = {height: size.currentTarget.innerHeight, width: size.currentTarget.innerWidth};
    });
  }


  get isMobile()
  {
    return this.windowSize.width <= 850;
  }

  ngOnDestroy()
  {
    this.windowSizeSubscription$.unsubscribe();
  }
}
