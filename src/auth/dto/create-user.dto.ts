import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{

    @ApiProperty({
        description: 'User email (unique)',
        nullable: false
      })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
            message: 'The password must have a Uppercase, lowercase latter and a number'
    })
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    fullName: string;
}