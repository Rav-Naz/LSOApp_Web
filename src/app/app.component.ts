import { ConfirmComponent } from './shared/confirm/confirm.component';
import { UiService } from 'src/app/services/ui.service';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(public ui: UiService){}

  @ViewChild(ConfirmComponent) confirm: ConfirmComponent;

  ngAfterViewInit(): void {
    this.ui.windowSizeObs = fromEvent(window, 'resize');
    this.ui.setConfirmComponent(this.confirm);
  }
}
