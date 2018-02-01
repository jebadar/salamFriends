import { Injectable } from '@angular/core';
import { Router,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserServicesService} from '../users/user-services.service'

@Injectable()
export class AppGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private userServicesService:UserServicesService
  )
  {}
    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
  {
    if (this.userServicesService.isAuthenticated()) 
    {
        //logged in so return true
        return true;
    }
    else
    {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/welcome'], { queryParams: { returnUrl: state.url }});
      return false;
    }

  }
}
