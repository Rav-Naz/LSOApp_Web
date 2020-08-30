import { UiService } from './ui.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private ui: UiService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.isLogged)
    {
      return true;
    }
    else
    {
      this.ui.showFeedback('error', 'Zaloguj się, aby uzyskać dostęp do serwisu', 3);
      this.ui.resetLoadingEvents();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
