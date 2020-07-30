import { UserService } from './database/user.service';
import { DatabaseModule } from './database/database.module';
import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DatabaseModule,
    MongooseModule.forRoot('mongodb+srv://dbUser:1EBNMlT2NJ7wcWI7@cluster0.gco4s.gcp.mongodb.net/arya?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }
  ],
})
export class AppModule { }
