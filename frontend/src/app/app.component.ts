import { Component, ComponentFactoryResolver } from '@angular/core';
import { faHome, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginService } from './shared/login.service';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('popOverState', [
      // state('true', style({
      //   opacity: 1
      // })),
      // state('false', style({
      //   opacity: 1
      // })),

      transition('false => true', animate('2000ms', keyframes([
        style({ transform: 'scale(1.0)', offset: 0 }),
        style({ transform: 'scale(1.1)', offset: 0.33 }),
        style({ transform: 'scale(1.05)', offset: 0.66 }),
        style({ transform: 'scale(1)', offset: 1.0 })
        // style({ transform: 'translateX(0)    rotateY(0)', offset: 0 }),
        // style({ transform: 'translateX(50%)  rotateY(90deg)', offset: 0.33 }),
        // style({ transform: 'translateY(-75%) rotateY(180deg)', offset: 0.66 }),
        // style({ transform: 'translateX(-100%)', offset: 1.0 })
      ])))
    ])
  ]
})
export class AppComponent {

  menu = IMenu.HOME;
  IMenu = IMenu;
  constructor(
    faConfig: FaConfig,
    private cfr: ComponentFactoryResolver,
    private route: Router,
    readonly loginService: LoginService,
    readonly userService: UserService,
  ) {
    faConfig.defaultPrefix = 'fas'
    faConfig.fixedWidth = true;
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: NavigationEnd) => {
        console.log(event.urlAfterRedirects);
        
        this.menu = IMenu[event.urlAfterRedirects.replace('/', '').toUpperCase()]
        console.log(this.menu);

      });

  }
  title = 'frontend';
  homeIcon = faChartLine;


  enter = () => {
    document.getElementById('dropdown-content').setAttribute('style', 'display:block');
  }
  exit = () => {
    document.getElementById('dropdown-content').setAttribute('style', 'display:none');
  }

  logOut(){
    this.loginService.logOut();
    this.route.navigate(['/login'])
  }

  decode(data) {
    return atob(data);
  }

}

export enum IMenu {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  LOGOUT = 'LOGOUT'
}