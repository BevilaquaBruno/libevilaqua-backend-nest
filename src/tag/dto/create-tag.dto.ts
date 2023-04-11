import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'Informe novamente a tag.' })
  @Length(1, 50, {
    message: 'A tag deve ter entre 1 e 50 caracteres.',
  })
  description: string;
}
