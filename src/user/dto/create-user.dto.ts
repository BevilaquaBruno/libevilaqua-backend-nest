import { IsNotEmpty, IsEmail, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Campo nome é obrigatório.' })
  @Length(3, 50, { message: 'Informe um nome entre 3 e 50 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @Length(7, 50, { message: 'Informe um e-mail válido.' })
  email: string;
  password: string;
  verify_password: string;
}
