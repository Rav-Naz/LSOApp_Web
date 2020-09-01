import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowSize } from 'src/app/models/window_size.model';

@Component({
  selector: 'app-duties-messages',
  templateUrl: './duties-messages.component.html',
  styleUrls: ['./duties-messages.component.css']
})
export class DutiesMessagesComponent implements OnInit, OnDestroy{

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
