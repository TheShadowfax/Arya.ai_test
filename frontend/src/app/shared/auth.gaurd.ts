import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';
import { from } from 'rxjs';

@Injectable({providedIn:'root'})
export class AuthGaurd implements CanActivate {
    constructor(
        private readonly loginService: LoginService,
        private readonly router: Router
    ) {
        console.log('auth gaurd');
        
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userLoggedIn = this.loginService.isUserLoggedIn();
        if (!userLoggedIn && !route.url.toString().includes('login')) {
            this.router.navigate(['/login']);
        }
        console.log('userLoggedIn', this.loginService.getSnapShot());

        return userLoggedIn;
    }
}