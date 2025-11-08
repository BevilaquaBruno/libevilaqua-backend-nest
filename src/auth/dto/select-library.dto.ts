import { IsAscii, IsEmail, IsNumber } from "class-validator";

export class SelectLibraryDto {
  @IsEmail({}, { message: 'user.email.invalid' })
  email: string;
  
  @IsAscii({ message: 'user.password.invalid' })
  password: string;

  @IsNumber({}, { message: 'user.library.invalid' })
  libraryId: number;
}
