import { CreateLibraryDto } from './create-library.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateLibraryDto extends PartialType(CreateLibraryDto) {
  @ApiProperty({ example: 1, description: 'Library id.' })
  id: number;
}
