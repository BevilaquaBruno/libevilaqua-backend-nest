import { CreateGenreDto } from './create-genre.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @ApiProperty({ example: 1, description: 'Genre id.' })
  id: number;
}
