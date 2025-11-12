import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePublisherDto {
  @ApiProperty({ example: 'Editora edipro', description: 'Publisher name.' })
  @IsString({ message: 'publisher.description.invalid' })
  @IsNotEmpty({ message: 'publisher.description.invalid' })
  @Length(1, 50, {
    message: 'publisher.description.length_error',
  })
  name: string;

  @ApiProperty({ example: 'Brazil', examples: ['Brazil', null], description: 'Publisher country.' })
  @IsString({ message: 'publisher.country.invalid' })
  @IsNotEmpty({ message: 'publisher.country.invalid' })
  @Length(1, 50, {
    message: 'publisher.country.length_error',
  })
  country: string;
}
