import { CreateTypeDto } from './create-type.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  @ApiProperty({ example: 1, description: 'Type id.' })  
  id: number;
}
