import { IsNotEmpty, IsEmail, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'user.name.required' })
  @Length(3, 50, { message: 'user.name.length_error' })
  name: string;

  @IsEmail({}, { message: 'user.email.invalid' })
  @Length(7, 50, { message: 'user.email.invalid' })
  email: string;
  password: string;
  verify_password: string;
}
