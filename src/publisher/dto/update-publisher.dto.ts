import { CreatePublisherDto } from './create-publisher.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdatePublisherDto extends PartialType(CreatePublisherDto) {
  @ApiProperty({ example: 1, description: 'Publisher id.' })
  id: number;
}
