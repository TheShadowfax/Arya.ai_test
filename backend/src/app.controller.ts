import { Controller, Get, Post, Body, HttpException, HttpStatus, SerializeOptions, Patch, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthDto, UserDto } from './interfaces/user.dto';
import { UserEntity } from './database/entities/user.entity';

@Controller()
@SerializeOptions({
  excludePrefixes: ['_'],
})
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/login')
  login(@Body() body: AuthDto) {
    return this.appService.login(body);
  }

  @Patch('/user')
  patchUser(@Body() body: UserDto) {
    return this.appService.patchUser(body);
  }

  @Get('/store')
  getData(
    @Query('from', ParseIntPipe) from: number,
    @Query('to', ParseIntPipe) to: number
  ) {
    const inception = new Date('-1').getTime() / 1000;

    if (from < inception || to < inception || from > to) {
      throw new HttpException('Invalid Time Range', HttpStatus.BAD_REQUEST)
    }
    return this.appService.getDate(from,to);
  }
}
