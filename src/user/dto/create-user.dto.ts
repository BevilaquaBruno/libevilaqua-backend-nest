import { IsNotEmpty, IsEmail, Length, IsEnum } from 'class-validator';
import { Languages } from '../../helpers/enum/Languages.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    example: 'Bruno Fernando Bevilaqua',
    description: 'User name.',
  })
  @IsNotEmpty({ message: 'user.name.required' })
  @Length(3, 50, { message: 'user.name.length_error' })
  name: string;

  @ApiProperty({ example: 'temp@mail.com', description: 'User E-mail.' })
  @IsEmail({}, { message: 'user.email.invalid' })
  @Length(7, 50, { message: 'user.email.invalid' })
  email: string;

  @ApiProperty({ example: '123456', description: 'User password.' })
  password: string;

  @ApiProperty({ example: '123456', description: 'User password again.' })
  verify_password: string;

  @ApiProperty({
    example: 'en',
    examples: ['en', 'pt-br'],
    description: 'User language.',
  })
  @IsEnum(Languages, { message: 'user.language.invalid' })
  language: Languages;
}
