import { Injectable } from '@nestjs/common';
import { ConvertDto } from './utils/dtos';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DbService } from './db/db.service';
import { Transaction } from '@prisma/client';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private config: ConfigService, private db: DbService) {}
  
  async convert(dto: ConvertDto, userId: string): Promise<Transaction> {
  try {
    const api_key = this.config.get('API_KEY')
    const response = await lastValueFrom(
    this.httpService.get(`https://exchange-rates.abstractapi.com/v1/live?api_key=${api_key}&base=${dto.base}&target=${dto.target}`)) 
    const amount = dto.amount
    const convertedAmount = Object.values( response.data.exchange_rates )[0] as number * amount
   
    return this.saveTransaction(amount,dto.base,dto.target,userId,convertedAmount)
  } catch (e) {
    throw e
  }
  }


  async saveTransaction (amount,base,target,userId,convertedAmount): Promise<Transaction> {
    try{
      const transaction = await this.db.transaction.create({
        data: {
          amount: +amount,
          base,
          target,
          userId,
          convertedAmount,
        },
       })
       return transaction

      } catch(e){throw e}
    
  }

  
}
