import { ParafiaService } from './../services/parafia.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {

  constructor(public userService: UserService, public parafiaService: ParafiaService, private router: Router) { }

  ngOnInit(): void {
    this.userService.pobierzUsera().then(res => {
      this.parafiaService.pobierzParafie().then(res2 => {
        this.router.navigateByUrl('/admin-view/(main:acolythe-details/104)');
      });
    });
    this.parafiaService.pobierzMinistrantow().then(res => {
      // this.ui.zmienStan(1,false)
    });
  }

}
