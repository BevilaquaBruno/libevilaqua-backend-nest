import { IsEmail, Length, IsNotEmpty } from 'class-validator';
export class MainAuthDto {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @Length(7, 50, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'Informe a senha.' })
  password: string;
}
