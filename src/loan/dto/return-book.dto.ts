import { Matches } from 'class-validator';

export class ReturnBookDto {
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de devolução válida.',
  })
  return_date: Date;
}
