import { IsEmail, Length, IsNotEmpty } from 'class-validator';
export class MainAuthDto {
  @IsEmail({}, { message: 'user.email.invalid' })
  @Length(7, 50, { message: 'user.email.invalid' })
  email: string;

  @IsNotEmpty({ message: 'user.password.invalid' })
  password: string;
}
