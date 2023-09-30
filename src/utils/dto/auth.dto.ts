import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @ApiProperty({
        description: 'email',
        example: 'mmm@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'password',
        example: '123456789'
    })
    @MinLength(8)
    @MaxLength(80)
    @IsString()
    @IsNotEmpty()
    password: string;
}

