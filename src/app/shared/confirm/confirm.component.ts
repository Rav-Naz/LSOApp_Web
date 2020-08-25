import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  context: string = null;

  @Output() decision = new EventEmitter<boolean>();

  async awaitToDecision(context: string)
  {
    this.context = context;
    return new Promise((resolve) => {
      this.decision.subscribe(event => {
        this.context = null;
        resolve(event);
      });
    });
  }

  decide(value: boolean)
  {
    this.decision.emit(value);
  }
}
