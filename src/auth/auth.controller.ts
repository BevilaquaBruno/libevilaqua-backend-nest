import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MainAuthDto } from './dto/main-auth.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: MainAuthDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (null == user) {
      throw new HttpException('Não existe nenhum usuário com este e-mail.', HttpStatus.BAD_REQUEST);
    }

    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('isValid')
  isValid() {
    // Sempre retorna true porque se ele chegar aqui é porque está autenticado.
    return { isValid: true };
  }

  @Post('send-reset-password')
  async sendResetPassword(@Body() sendResetPaswordDto: { email: string }) {
    // Valida o e-mail 
    if ('' == sendResetPaswordDto.email)
      throw new HttpException('Informe o e-mail novamente.', HttpStatus.BAD_REQUEST);

    // Verifica se usuário existe
    const user = await this.userService.findByEmail(sendResetPaswordDto.email);
    if (null == user)
      throw new HttpException('Não existe nenhum usuário com este e-mail.', HttpStatus.BAD_REQUEST);

    const token = await this.authService.generateResetToken(user);
    await this.mailService.sendResetPasswordRequest(user.name, user.email, token);

    return {
      statusCode: 200,
      message: 'E-mail enviado com sucesso.',
    };
  }

  @UseGuards(AuthGuard)
  @Post('reset-password')
  async resetPassword(@Req() req: Request, @Body() resetPasswordDto: { newPassword: string, confirmNewPassword: string }) {
    // O token é um "Bearer XXX", separa ele e retorna o token se ele for um Bearer
    const [type, token] = req.headers['authorization'].split(' ') ?? [];

    // Pega o resetToken
    const resetToken = await this.authService.findOneToken(token);

    if(resetToken.used)
      throw new HttpException('Token já usado, tente novamente', HttpStatus.BAD_REQUEST);
  
    // Valida as senhas
    if (resetPasswordDto.newPassword != resetPasswordDto.confirmNewPassword)
      throw new HttpException('As senhas estão diferentes.', HttpStatus.BAD_REQUEST);

    const currentUser: { username: string, sub: string } = req['user'];
    // Valida o e-mail
    if ('' == currentUser.username)
      throw new HttpException('Erro ao atualizar a senha, tente novamente.', HttpStatus.BAD_REQUEST);

    // Verifica se usuário existe
    const user = await this.userService.findByEmail(currentUser.username);
    if (null == user)
      throw new HttpException('Erro ao atualizar a senha, tente novamente.', HttpStatus.BAD_REQUEST);

    const encriptedPasword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    const updatedUser = await this.userService.updatePassword(user.id, encriptedPasword);
    if (updatedUser.affected == 1) {
      // Atualiza o token como used
      await this.authService.updateResetToken(+resetToken.id, true);
      return {
        statusCode: 200,
        message: 'Senha atualizada com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da senha, tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
