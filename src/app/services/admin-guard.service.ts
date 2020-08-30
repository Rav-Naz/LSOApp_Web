import { AuthService } from './auth.service';
import { UiService } from 'src/app/services/ui.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private ui: UiService,
              private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.isAdmin)
    {
      return true;
    }
    else
    {
      this.ui.showFeedback('error', 'Nie masz wystarczających uprawnień', 3);
      this.ui.resetLoadingEvents();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
