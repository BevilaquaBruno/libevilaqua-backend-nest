import { IsEmail, Length, IsNotEmpty } from 'class-validator';
export class MainAuthDto {
  @IsEmail({}, { message: 'user.dto.email.invalid' })
  @Length(7, 50, { message: 'user.dto.email.invalid' })
  email: string;

  @IsNotEmpty({ message: 'user.dto.password.invalid' })
  password: string;
}
