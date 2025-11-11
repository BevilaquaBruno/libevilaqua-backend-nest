import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'From Dafne', description: 'Tag description.' })
  @IsString({ message: 'tag.description.invalid' })
  @Length(1, 50, {
    message: 'tag.description.length_error',
  })
  description: string;
}
