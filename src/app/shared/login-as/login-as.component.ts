import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-as',
  templateUrl: './login-as.component.html',
  styleUrls: ['./login-as.component.css']
})
export class LoginAsComponent {

  public visible = false;

  @Output() decision = new EventEmitter<boolean>();

  async awaitToDecision()
  {
    this.visible = true;
    return new Promise((resolve) => {
      this.decision.subscribe(event => {
        this.visible = false;
        resolve(event);
      });
    });
  }

  decide(value: boolean)
  {
    this.decision.emit(value);
  }

}
