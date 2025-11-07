import { Matches } from 'class-validator';

export class ReturnBookDto {
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.return_date.invalid',
  })
  return_date: Date;
}
