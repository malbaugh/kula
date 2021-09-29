import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../CurrentUser/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private router: Router,
      private currentUserService: CurrentUserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authorized = this.currentUserService.CurrentUserValue;
    if (authorized) {
        // authorised so return true
        return true;
    }

    // not logged in so redirect to landing page with the return url
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
