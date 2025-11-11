import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNotEmpty } from 'class-validator';
export class MainAuthDto {
  @ApiProperty({ example: 'temp@mail.com', description: 'E-mail for login.' })
  @IsEmail({}, { message: 'user.email.invalid' })
  @Length(7, 50, { message: 'user.email.invalid' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Password for login.' })
  @IsNotEmpty({ message: 'user.password.invalid' })
  password: string;
}
