import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePublisherDto {
  @IsString({ message: 'publisher.description.invalid' })
  @IsNotEmpty({ message: 'publisher.description.invalid' })
  @Length(3, 50, {
    message: 'publisher.description.length_error',
  })
  name: string;

  @IsString({ message: 'publisher.country.invalid' })
  @IsNotEmpty({ message: 'publisher.country.invalid' })
  @Length(3, 50, {
    message: 'publisher.country.length_error',
  })
  country: string;
}
