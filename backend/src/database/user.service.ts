import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthDto, UserDto } from '../interfaces/user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModal: Model<User>
    ) {
        const _user = new UserEntity({ id: 1, email: 'srujan.kumar@gmail.com', password: 'oolmnki990*', firstName: 'shrujan', lastName: "kumar" })

    }

    login(reqDto: AuthDto) {
        return this.userModal.findOne({ ...reqDto }).then((val) => {
            if (!val) throw new UnauthorizedException()
            console.log(val.toJSON());

            return new UserEntity({ ...val.toJSON() })
        })
    }

    patchUser(body: UserDto) {
        return this.userModal.findOneAndUpdate({ id: body.id }, { $set: { ...body } }, { new: true }).then((v) => {
            if (!v) {
                throw new BadRequestException();
            }
            return new UserEntity({ ...v.toJSON() })
        })
    }

}
