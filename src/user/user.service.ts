import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import * as argon from 'argon2'
import { AuthDto } from 'src/utils/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private db: DbService, private jwt: JwtService){}

  async signinLocal(dto: AuthDto): Promise<{access_token: string}> {
    try{
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email
            }
        })
    
        if (!user) {
            throw new NotFoundException('Credentials incorrect',)
        }
    
        const pwMatches = await argon.verify(user.hash, dto.password);
    
        if (!pwMatches) {
            throw new ForbiddenException('Credentials incorrect',)
        }
    
        return this.signUser(user.id);
    } catch(e){throw e}

    
  }

 async signupLocal(dto: AuthDto): Promise<{access_token: string}> {
    try{
        const hash = await argon.hash(dto.password);
        const user = await this.db.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });
        return this.signUser(user.id);
    } catch(e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }
        }
        throw e
    }
    
  }

async signUser (sub: string): Promise<{access_token: string}> {
   try{
    const payload = {
        id: sub
    }
    const token = await this.jwt.signAsync({ payload });
    return {
        access_token: token,
    }
   } catch(e){throw e}
  }

  async getHistory(userId): Promise<Transaction[] | null> {
    try{
        const transaction = await this.db.transaction.findMany({
            where: {
                userId,
            }
        })
        return transaction
    }catch(e) {throw e}
    
  }
}
