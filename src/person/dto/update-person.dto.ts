import { CreatePersonDto } from './create-person.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @ApiProperty({ example: 1, description: 'Person id.' })
  id: number;
}
