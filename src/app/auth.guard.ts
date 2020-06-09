import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) {

  }

  canActivate() {
    if (auth().currentUser) {
      return true;
      } else {
      this.router.navigate[('/home')];
      return false;
      }
    }
}


/*

import { AuthService } from './service/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      console.log('canActivate trueee');
      this.router.navigate[('/home')];
      }
        return true;
    }
}


*/





/*


import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) {

  }

  canActivate() {
    if (auth().currentUser) {
      console.log('canActivate trueee');
      return true;
      } else {
        this.router.navigate[('/home')];
        return false;
      }
    }
}



*/
