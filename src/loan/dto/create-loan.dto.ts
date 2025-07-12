import {
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateLoanDto {
  @IsString({ message: 'Informe a descrição do empréstimo.' })
  @Length(1, 250, {
    message: 'A descrição do empréstimo deve ter entre 1 e 250 caracteres.',
  })
  description: string;

  @ValidateIf(
    (thisLoan) =>
      thisLoan.return_date !== null &&
      thisLoan.return_date !== undefined &&
      thisLoan.return_date !== '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de devolução válida.',
  })
  return_date: Date;

  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de previsão de devolução válida.',
  })
  must_return_date: Date;

  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de empréstimo válida.',
  })
  loan_date: Date;

  @IsNumber({}, { message: 'Selecione o livro novamente.' })
  bookId: number;

  @ValidateIf(
    (thisLoan) =>
      thisLoan.personId !== null &&
      thisLoan.personId !== undefined &&
      thisLoan.personId !== '',
  )
  @IsNumber({}, { message: 'Selecione a pessoa novamente.' })
  personId: number;
}
