import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({
    example: 'Book',
    examples: ['Book', 'Magazine'],
    description: 'Type description.',
  })
  @IsString({ message: 'type.description.invalid' })
  @Length(1, 50, {
    message: 'type.description.length_error',
  })
  description: string;
}
