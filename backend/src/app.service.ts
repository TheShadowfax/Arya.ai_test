import { Injectable } from '@nestjs/common';
import { AuthDto, UserDto } from './interfaces/user.dto';
import { UserService } from './database/user.service';
import { StoreService } from './database/store.service';

@Injectable()
export class AppService {

  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService,
  ) { }
  login(body: AuthDto) {
    return this.userService.login(body);
  }
  getHello(): string {
    return 'Hello World!';
  }
  patchUser(body: UserDto) {
    return this.userService.patchUser(body);
  }
  getDate(from: number, to: number) {
    return this.storeService.getDate(from,to);
  }

}
