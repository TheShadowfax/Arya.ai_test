import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema, User } from './entities/user.entity';
import { UserService } from './user.service';
import { Store, StoreSchema } from './entities/store.entity';
import { StoreService } from './store.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Store.name, schema: StoreSchema }])
    ],
    controllers: [],
    providers: [
        UserService,
        StoreService
    ],
    exports: [
        UserService,
        StoreService
    ]
})
export class DatabaseModule { }
