import {
  Matches,
  IsNotEmpty,
  IsString,
  ValidateIf,
  Length,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Informe um nome válido' })
  @Length(1, 60, { message: 'O nome deve ter até 60 caracteres' })
  name: string;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.birth_date != null &&
      thisAuthor.birth_date != undefined &&
      thisAuthor.birth_date != '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de nascimento válida.',
  })
  birth_date: Date;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.death_date != null &&
      thisAuthor.death_date != undefined &&
      thisAuthor.death_date != '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'Informe uma data de falecimento válida.',
  })
  death_date: Date;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.bio != null &&
      thisAuthor.bio != undefined &&
      thisAuthor.bio != '',
  )
  @IsString({ message: 'Informe a biografia novamente.' })
  bio: string;
}
