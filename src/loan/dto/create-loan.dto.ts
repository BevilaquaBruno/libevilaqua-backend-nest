import {
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { CreateBookDto } from 'src/book/dto/create-book.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';

export class CreateLoanDto {
  @IsString({ message: 'Informe a descrição do empréstimo.' })
  @Length(1, 250, {
    message: 'A descrição do empréstimo deve ter entre 1 e 250 caracteres',
  })
  description: string;

  @ValidateIf((thisLoan) => thisLoan.return_date !== null)
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

  book: CreateBookDto;

  person: CreatePersonDto;
}