import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateLoanDto {
  @IsString({ message: 'loan.description.invalid' })
  @Length(1, 250, {
    message: 'loan.description.length_error',
  })
  description: string;

  @ValidateIf(
    (thisLoan) =>
      thisLoan.return_date !== null &&
      thisLoan.return_date !== undefined &&
      thisLoan.return_date !== '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.return_date.invalid',
  })
  return_date: Date;

  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.must_return_date.invalid',
  })
  must_return_date: Date;

  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.loan_date.invalid',
  })
  loan_date: Date;

  @IsNotEmpty({ message: 'loan.book.required' })
  @IsNumber({}, { message: 'loan.book.invalid' })
  bookId: number;

  @IsNotEmpty({ message: 'loan.person.required' })
  @IsNumber({}, { message: 'loan.person.invalid' })
  personId: number;
}
