import { CreateAuthorDto } from './create-author.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @ApiProperty({ example: '1', description: 'Authors id.' })
  id: number;
}
