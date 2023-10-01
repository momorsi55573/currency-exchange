import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConvertDto } from './utils/dtos';
import { GetUser } from './utils/decorators';
import { JwtGuard } from './utils/guards';
import { Transaction } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @UseGuards(JwtGuard)
  @Post('convert')
  convert(@Body() dto: ConvertDto, @GetUser() userId: string): Promise<Transaction> {
    return this.appService.convert(dto, userId);
  }
}
