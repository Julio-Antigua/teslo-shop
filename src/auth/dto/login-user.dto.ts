import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto{

    @ApiProperty({
        description: 'user email (unique)',
        nullable: false
      })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'user password',
        nullable: false,
        minLength: 6,
        maxLength: 50
      })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
            message: 'The password must have a Uppercase, lowercase latter and a number'
    })
    password: string;

}