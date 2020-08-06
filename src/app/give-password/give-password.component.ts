import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-give-password',
  templateUrl: './give-password.component.html',
  styleUrls: ['./give-password.component.css']
})
export class GivePasswordComponent implements OnInit {

  public _email: string = null;
  public _password: string = null;
  public _cofirmPassword: string = null;
  public _code: string = null;

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  get isPasswordSame() {
    return this._password === this._cofirmPassword ? true : false;
  }

}
