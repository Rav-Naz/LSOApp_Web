import { ConfirmComponent } from './shared/confirm/confirm.component';
import { UiService } from 'src/app/services/ui.service';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { fromEvent } from "rxjs";
import { WindowSize } from './models/window_size.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  public windowSize: WindowSize = { height: 1080, width: 1920};
  public promotion = false;

  constructor(public ui: UiService){}

  @ViewChild(ConfirmComponent) confirm: ConfirmComponent;

  ngOnInit(): void {

    const prom = localStorage.getItem('promotion');
    if (prom === null || prom === undefined)
    {
      this.promotion = true;
    }
    else
    {
      const rand = Math.random();
      if (rand >= .3 && rand <= .4){ this.promotion = true; }
    }

    this.windowSize = {height: window.innerHeight, width: window.innerWidth };
    this.ui.windowSizeObs = fromEvent(window, 'resize');
  }

  ngAfterViewInit(): void {
    this.ui.setConfirmComponent(this.confirm);
  }

  close()
  {
    localStorage.setItem('promotion', 'true');
    this.promotion = false;
  }

  get isPromotion()
  {
    // return true;
    return this.windowSize.width <= 850 && this.promotion;
  }
}
