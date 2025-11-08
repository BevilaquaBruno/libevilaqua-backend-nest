import {
  Matches,
  IsNotEmpty,
  IsString,
  ValidateIf,
  Length,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'author.name.invalid' })
  @Length(1, 60, { message: 'author.name.length_error' })
  name: string;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.birth_date != null &&
      thisAuthor.birth_date != undefined &&
      thisAuthor.birth_date != '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'author.birth_date.invalid',
  })
  birth_date: Date;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.death_date != null &&
      thisAuthor.death_date != undefined &&
      thisAuthor.death_date != '',
  )
  @Matches(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, {
    message: 'author.death_date.invalid',
  })
  death_date: Date;

  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.bio != null &&
      thisAuthor.bio != undefined &&
      thisAuthor.bio != '',
  )
  @IsString({ message: 'author.bio.invalid' })
  bio: string;
}
