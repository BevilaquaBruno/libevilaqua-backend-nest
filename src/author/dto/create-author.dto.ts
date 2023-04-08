import { Matches, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Informe um nome válido' })
  name: string;

  @ValidateIf((thisAuthor) => thisAuthor.birth_date !== null)
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de nascimento válida.',
  })
  birth_date: Date;

  @ValidateIf((thisAuthor) => thisAuthor.death_date !== null)
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de morte válida.',
  })
  death_date: Date;

  @ValidateIf((thisAuthor) => thisAuthor.bio !== null)
  @IsString({ message: 'Informe a biografia novamente.' })
  bio: string;
}
