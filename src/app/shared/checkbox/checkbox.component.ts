import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {

  @Output() checkStatus = new EventEmitter<boolean>();

  @Input() status;

  zmien()
  {
    this.checkStatus.emit(!this.status);
  }
}
