import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MainAuthDto } from './dto/main-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('Login')
  signIn(@Body() signInDto: MainAuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
