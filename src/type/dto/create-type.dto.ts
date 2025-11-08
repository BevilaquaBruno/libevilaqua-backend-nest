import { IsString, Length } from 'class-validator';

export class CreateTypeDto {
  @IsString({ message: 'type.description.invalid' })
  @Length(1, 50, {
    message: 'type.description.length_error',
  })
  description: string;
}
