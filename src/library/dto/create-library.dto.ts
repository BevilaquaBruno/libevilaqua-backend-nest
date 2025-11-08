import { IsNotEmpty, Length } from "class-validator";

export class CreateLibraryDto {
  @IsNotEmpty({ message: 'library.description.invalid' })
  @Length(1, 50, { message: 'library.description.length_error' })
  description: string;
}
