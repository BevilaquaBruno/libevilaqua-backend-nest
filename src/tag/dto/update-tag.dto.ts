import { CreateTagDto } from './create-tag.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({ example: 1, description: 'Tag id.' })
  id: number;
}
