import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
export class CreateGenreDto {
  @ApiProperty({ example: 'Action', description: 'Genre description.' })
  @IsNotEmpty({ message: 'genre.description.invalid' })
  @Length(1, 50, { message: 'genre.description.length_error' })
  description: string;
}
