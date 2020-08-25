import { UiService } from 'src/app/services/ui.service';
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

  constructor(public userService: UserService, public parafiaService: ParafiaService, private router: Router,
              private ui: UiService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.ui.addLoadingEvent();
    }, 10);
    this.userService.pobierzUsera().then(res => {
      this.parafiaService.pobierzParafie().then(res2 => {
        if (this.router.url === '/admin-view')
        {
          this.router.navigateByUrl('/admin-view/(main:acolythes-messages)');
        }
        setTimeout(() => {
          this.ui.removeLoadingEvent();
        }, 10);
      });
    });
    this.parafiaService.pobierzMinistrantow().then(res => {
      // this.ui.removeLoadingEvent();
      setTimeout(() => {
        this.ui.removeLoadingEvent();
      }, 10);
    });
  }

  openURL(url: string)
  {
    window.open(url, '_blank');
  }

}
