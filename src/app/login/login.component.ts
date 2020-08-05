import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public _email: string = null;
  public _password: string = null;

  ladowanie = false;

  constructor() { }

  ngOnInit(): void {
    // this._email = localStorage.getItem('email');
    // this._haslo = localStorage.getItem('pass');
  }

  signIn() {
    // localStorage.setItem('email', this._email);
    // localStorage.setItem('pass', this._haslo);
  }
}
