import { IsString, Length } from 'class-validator';

export class CreateTypeDto {
  @IsString({ message: 'Informe novamente a descrição do tipo.' })
  @Length(1, 50, {
    message: 'A descrição do tipo deve ter entre 1 e 50 caracteres.',
  })
  description: string;
}
