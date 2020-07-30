import { Exclude, Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true, autoCreate: true, collection: 'Users', autoIndex: true })
export class User extends Document {
    @Prop({ auto: true, unique: true })
    id: number;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    dp: string;
}


export class UserEntity {

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    @Exclude()
    password: string;
    dp: string;

    @Expose()
    get fullName(): string {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
    }


    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);