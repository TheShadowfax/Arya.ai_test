import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { faAt, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FaConfig, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LoginService } from '../shared/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { map, filter, first, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  emailIcon = faAt;
  passwordIcom = faEyeSlash;

  showPassowrd = false;
  @ViewChild('password', { static: true }) iconComponent: FaIconComponent;

  userLoginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] }),
  })

  i = 0;
  constructor(
    faConfig: FaConfig,
    private cfr: ComponentFactoryResolver,
    readonly loginService: LoginService,
    private readonly router: Router
  ) {
    faConfig.defaultPrefix = 'far'
    faConfig.fixedWidth = true;

    this.loginService.state$.pipe(map(state => state.userLoggedIn)).subscribe((val) => {
      if(val) this.router.navigate(['/'])
    })
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  togglePassword() {
    this.showPassowrd = !this.showPassowrd;
    if (this.showPassowrd) {
      this.iconComponent.icon = faEye;
    } else {
      this.iconComponent.icon = faEyeSlash;
    }
    this.iconComponent.render()
    console.log('toggle password', this.showPassowrd, this.iconComponent);

  }

  attempLogin() {
    return this.loginService.attemptLogin(this.userLoginForm.controls.email.value, this.userLoginForm.controls.password.value).then((v) => {
      // this.router.navigate(['/home']).then((v) => {
      //   console.log(v);
      // }).catch((e) => {
      //   console.log(e);

      // })
    })
  }

  logOut() {
    this.loginService.logOut();
  }

}
