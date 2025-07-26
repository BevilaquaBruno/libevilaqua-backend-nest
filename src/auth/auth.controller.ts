import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MainAuthDto } from './dto/main-auth.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: MainAuthDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if(null == user){
      throw new HttpException('Não existe nenhum usuário com este e-mail.', HttpStatus.BAD_REQUEST);
    }

    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('isValid')
  create() {
    // Sempre retorna true porque se ele chegar aqui é porque está autenticado.
    return { isValid: true };
  }
}
