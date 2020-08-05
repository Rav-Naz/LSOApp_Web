import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.css']
})
export class RemindPasswordComponent implements OnInit {

  constructor(private location: Location) { }

  _email: string;

  ngOnInit(): void {
  }

  backNavigation() {
    this.location.back();
  }
}
