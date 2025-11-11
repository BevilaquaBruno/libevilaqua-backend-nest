import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 'Book loaned during work.', description: 'Loan description.' })
  @IsString({ message: 'loan.description.invalid' })
  @Length(1, 250, {
    message: 'loan.description.length_error',
  })
  description: string;

  @ApiProperty({ example: '2024-01-01', examples: ['2025-01-01', null], description: 'Loan returned date.' })
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

  @ApiProperty({ example: '2024-31-12', examples: ['2024-31-12', null], description: 'Loan return prevision date.' })
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.must_return_date.invalid',
  })
  must_return_date: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Loan date.' })
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'loan.loan_date.invalid',
  })
  loan_date: Date;

  @ApiProperty({ example: 1, description: 'Book id.' })
  @IsNotEmpty({ message: 'loan.book.required' })
  @IsNumber({}, { message: 'loan.book.invalid' })
  bookId: number;

  @ApiProperty({ example: 1, description: 'Person who received the book.' })
  @IsNotEmpty({ message: 'loan.person.required' })
  @IsNumber({}, { message: 'loan.person.invalid' })
  personId: number;
}
