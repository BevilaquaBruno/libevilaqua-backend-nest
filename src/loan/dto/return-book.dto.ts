import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class ReturnBookDto {
  @ApiProperty({ example: '2024-01-01', examples: ['2025-01-01', null], description: 'Loan returned date.' })
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.return_date.invalid',
  })
  return_date: Date;
}
