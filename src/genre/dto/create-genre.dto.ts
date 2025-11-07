import { IsNotEmpty, Length } from 'class-validator';
export class CreateGenreDto {
  @IsNotEmpty({ message: 'genre.description.invalid' })
  @Length(1, 50, { message: 'genre.description.length_error' })
  description: string;
}
