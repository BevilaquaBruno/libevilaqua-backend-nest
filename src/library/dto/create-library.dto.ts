import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateLibraryDto {
  @ApiProperty({ example: 'Bevilaqua library', description: 'Library name.' })
  @IsNotEmpty({ message: 'library.description.invalid' })
  @Length(1, 50, { message: 'library.description.length_error' })
  description: string;
}
