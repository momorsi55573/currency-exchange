import { ApiProperty } from "@nestjs/swagger";
import { currency } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class ConvertDto {
   
    @ApiProperty({
        description: 'base',
        example: 'USD'
    })
    @IsNotEmpty()
    base: currency;

    @ApiProperty({
        description: 'target',
        example: 'EUR'
    })
    @IsNotEmpty()
    target: currency;
     
    @ApiProperty({
        description: 'amount',
        example: 5
    })
    @IsNotEmpty()
    amount: number;
}

