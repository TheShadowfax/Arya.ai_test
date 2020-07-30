import { IsEmail, IsNotEmpty, IsString, validate, ValidateIf, IsNumber, IsBase64, IsEmpty, IsNumberString, IsOptional } from 'class-validator';

export class AuthDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UserDto {
    @ValidateIf(o => o.firstName)
    @IsString()
    firstName: string;
    @ValidateIf(o => o.lastName)
    @IsString()
    lastName: string;
    @ValidateIf(o => o.password)
    @IsString()
    password: string;
    @IsNumber()
    // @IsNumberString()
    id: number;
    @IsBase64()
    @IsOptional()
    dp: string;

}