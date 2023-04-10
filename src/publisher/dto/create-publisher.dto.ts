import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePublisherDto {
  @IsString({ message: 'Informe o nome da publicadora' })
  @IsNotEmpty({ message: 'Informe o nome da publicadora' })
  @Length(3, 50, {
    message: 'O nome da publicadora deve ter entre 3 e 50 caracteres',
  })
  name: string;

  @IsString({ message: 'Informe o país da publicadora' })
  @IsNotEmpty({ message: 'Informe o país da publicadora' })
  @Length(3, 50, {
    message: 'O país da publicadora deve ter entre 3 e 50 caracteres',
  })
  country: string;
}
