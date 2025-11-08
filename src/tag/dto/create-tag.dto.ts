import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'tag.description.invalid' })
  @Length(1, 50, {
    message: 'tag.description.length_error',
  })
  description: string;
}
