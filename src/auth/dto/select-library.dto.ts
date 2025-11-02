import { IsAlphanumeric, IsAscii, IsEmail, IsNumber } from "class-validator";

export class SelectLibraryDto {
  @IsEmail({}, { message: 'Informe corretamente o e-mail.' })
  email: string;
  
  @IsAscii({ message: 'Dados incorretos no login, tente novamente.' })
  password: string;

  @IsNumber({}, { message: 'Informe corretamente a biblioteca.' })
  libraryId: number;
}
