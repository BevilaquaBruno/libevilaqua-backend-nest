import { ApiProperty } from "@nestjs/swagger";
import { IsAscii, IsEmail, IsNumber } from "class-validator";

export class SelectLibraryDto {
  @ApiProperty({ example: 'temp@mail.com', description: 'E-mail for selecting the library.' })
  @IsEmail({}, { message: 'user.email.invalid' })
  email: string;
  
  @ApiProperty({ example: 'JWT from login', description: 'Password in JWT format returned from sign-in.' })
  @IsAscii({ message: 'user.password.invalid' })
  password: string;

  @ApiProperty({ example: '1', description: 'Library id you want to access.' })
  @IsNumber({}, { message: 'user.library.invalid' })
  libraryId: number;
}
