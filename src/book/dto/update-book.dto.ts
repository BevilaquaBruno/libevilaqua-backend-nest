import { CreateBookDto } from './create-book.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({ example: 1, description: 'Book id.' })
  id: number;
}
