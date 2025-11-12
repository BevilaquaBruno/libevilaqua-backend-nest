import { ApiProperty } from '@nestjs/swagger';
import {
  Matches,
  IsNotEmpty,
  IsString,
  ValidateIf,
  Length,
} from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John Doe', description: 'Authors name.' })
  @IsNotEmpty({ message: 'author.name.invalid' })
  @Length(1, 60, { message: 'author.name.length_error' })
  name: string;

  @ApiProperty({ example: '2024-01-01', examples: ['2024-01-01', null], description: 'Authors birth date.' })
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

  @ApiProperty({ example: '2024-31-12', examples: ['2024-31-12', null], description: 'Authors death date.' })
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

  @ApiProperty({ example: 'Some text here.', examples: ['Some text here.', null], description: 'Authors bio.' })
  @ValidateIf(
    (thisAuthor) =>
      thisAuthor.bio != null &&
      thisAuthor.bio != undefined &&
      thisAuthor.bio != '',
  )
  @IsString({ message: 'author.bio.invalid' })
  @Length(1, 500, { message: 'author.bio.length_error' })
  bio: string;
}
