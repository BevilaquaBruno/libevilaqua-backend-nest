import { IsNotEmpty, IsEmail, Length, IsEnum } from 'class-validator';
import { Languages } from '../../helpers/enum/Languages.enum';
export class CreateUserDto {
  @IsNotEmpty({ message: 'user.name.required' })
  @Length(3, 50, { message: 'user.name.length_error' })
  name: string;

  @IsEmail({}, { message: 'user.email.invalid' })
  @Length(7, 50, { message: 'user.email.invalid' })
  email: string;
  password: string;
  verify_password: string;

  @IsEnum(Languages, { message: 'user.language.invalid'})
  language: Languages
}
