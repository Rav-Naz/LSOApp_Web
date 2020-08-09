import { ParafiaService } from './../services/parafia.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {

  constructor(public userService: UserService, public parafiaService: ParafiaService) { }

  ngOnInit(): void {
    this.parafiaService.pobierzParafie().then(res => {
    });
  }

}
