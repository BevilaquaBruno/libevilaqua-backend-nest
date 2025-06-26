import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePublisherDto {
  @IsString({ message: 'Informe o nome da editora' })
  @IsNotEmpty({ message: 'Informe o nome da editora' })
  @Length(3, 50, {
    message: 'O nome da editora deve ter entre 3 e 50 caracteres',
  })
  name: string;

  @IsString({ message: 'Informe o país da editora' })
  @IsNotEmpty({ message: 'Informe o país da editora' })
  @Length(3, 50, {
    message: 'O país da editora deve ter entre 3 e 50 caracteres',
  })
  country: string;
}
