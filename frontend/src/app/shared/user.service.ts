import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { State } from './state';
import { HttpClient } from '@angular/common/http';
import SHA3 from 'sha3';
import { environment } from '../../environments/environment';

export interface IUserDetailsState {
  id: number;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  updatedAt: string;
  fullName: string;
  dp: string;
  defaultDP: string;
  loading: boolean;
  error: boolean;
  password?: string;
}


@Injectable()
export class UserService extends State<IUserDetailsState>{
  constructor(
    private readonly http: HttpClient
  ) {
    super({
      loading: false,
      error: false,
      id: null,
      email: null,
      createdAt: null,
      defaultDP: null,
      dp: null,
      firstName: null,
      fullName: null,
      lastName: null,
      updatedAt: null
    });
    this.setState({ error: false , loading: false})
  }

  updateUserInfo(userInfo: Partial<IUserDetailsState>) {
    this.setState(userInfo);
  }

  postUserInfo(userInfo: Partial<IUserDetailsState>) {

    userInfo.id = this.store.getValue().id;

    if (userInfo.password) {
      const hash = new SHA3(512);
      hash.update(userInfo.password);
      const hex = hash.digest('hex');
      userInfo.password = hex;
    }
    this.setState({ loading: true, error: false });
    return this.http.patch(`${environment.backendUrl}user`, { ...userInfo }).toPromise().then((v: Partial<IUserDetailsState>) => {
      console.log(v);
      this.setState({ ...v })
    }).catch((err) => {
      this.setState({ error: true });
    }).finally(() => {
      this.setState({ loading: false });
    })
  }

}
