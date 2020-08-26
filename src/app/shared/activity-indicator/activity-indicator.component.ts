import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activity-indicator',
  templateUrl: './activity-indicator.component.html',
  styleUrls: ['./activity-indicator.component.css']
})
export class ActivityIndicatorComponent implements OnInit {

  @Input() size = 10;

  ngOnInit(): void {
    document.getElementById(`activityIndicator`).style.width = `${this.size}rem`;
    document.getElementById(`activityIndicator`).style.height = `${this.size}rem`;
    document.getElementById(`activityIndicator`).style.borderWidth = `${this.size / 10}rem`;
  }

}
