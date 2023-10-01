import { AuthDto } from 'src/utils/dtos';
import { UserService } from './user.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/utils/decorators';
import { JwtGuard } from 'src/utils/guards';
import { Transaction } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signinLocal(@Body() dto: AuthDto): Promise<{access_token: string}> {
    return this.userService.signinLocal(dto);
  }

  @Post('register')
  signupLocal(@Body() dto: AuthDto): Promise<{access_token: string}> {
    return this.userService.signupLocal(dto);
  }


  @UseGuards(JwtGuard)
  @Get('history')
    getHistory (@GetUser() userId: string): Promise<Transaction[] | null> {
        return this.userService.getHistory(userId);
    }

  
}
