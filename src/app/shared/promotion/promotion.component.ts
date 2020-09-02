import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent {

  @Output() clickClosed = new EventEmitter<any>();

  openURL(url: string) {
    window.open(url, '_blank');
  }
}
