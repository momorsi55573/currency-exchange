import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';


@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
