import { IsNotEmpty, Length } from 'class-validator';
export class CreateGenreDto {
  @IsNotEmpty({ message: 'Informe uma descrição válida.' })
  @Length(1, 50, { message: 'Descrição deve até 50 caracteres.' })
  description: string;
}
