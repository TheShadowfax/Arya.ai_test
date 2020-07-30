import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, combineLatest, from } from 'rxjs';
import { map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { State } from './state';

import { SHA3 } from 'sha3';
import { UserService, IUserDetailsState } from './user.service';


export interface IUserLoginState {
  userLoggedIn: boolean;
  loading: boolean;
  error: boolean;
}


@Injectable()
export class LoginService extends State<IUserLoginState>{

  constructor(
    private readonly http: HttpClient,
    protected readonly userService: UserService
  ) {
    super({
      userLoggedIn: false,
      loading: false,
      error: false,
    }
    )

    console.log('LoginService');

  }




  isUserLoggedIn() {
    return this.store.getValue().userLoggedIn;
  }

  attemptLogin(email: string, password: string) {
    this.setState({ loading: true, error: false });
    const hash = new SHA3(512);
    hash.update(password);
    const hex = hash.digest('hex');
    return this.http.post(`${environment.backendUrl}auth/login`, { email, password: hex }).toPromise().then((val: Partial<IUserDetailsState>) => {
      this.setState({ userLoggedIn: true });
      this.userService.updateUserInfo(val);
    }).catch((err) => {
      this.setState({ error: true });
    }).finally(() => {
      this.setState({ loading: false });
    })
  }

  logOut() {
    this.setState({ userLoggedIn: false });
  }

}

