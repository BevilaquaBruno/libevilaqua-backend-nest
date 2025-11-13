import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MainAuthDto } from './dto/main-auth.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { PayloadAuthDto } from './dto/payload-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { SelectLibraryDto } from './dto/select-library.dto';
import { LibraryService } from '../library/library.service';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
    private libraryService: LibraryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: MainAuthDto) {
    const user = await this.userService.findByEmail(signInDto.email);
    if (null == user) {
      throw new HttpException(
        'user.email.does_not_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const logged = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    const libraries = await this.libraryService.getLibrariesFromuser(user.id);
    if (logged) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: await this.jwtService.sign(
          { password: user.password },
          { expiresIn: '5m' },
        ),
        libraries: libraries,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('select-library')
  async selectLibrary(@Body() selectedLibrary: SelectLibraryDto) {
    try {
      const payload: { password: string } = await this.jwtService.verifyAsync(
        selectedLibrary.password,
        {
          secret: process.env['SECRET'],
        },
      );
      selectedLibrary.password = payload.password;

      // Verifica se o usuário existe
      const user = await this.userService.findByEmail(selectedLibrary.email);
      if (!user) {
        throw new HttpException(
          'user.email.does_not_exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verifica se a senha trazida está correta
      const encriptedPassword = true;
      const logged = await this.authService.signIn(
        selectedLibrary.email,
        selectedLibrary.password,
        encriptedPassword,
      );
      if (!logged) {
        throw new UnauthorizedException();
      }

      // Verifica se a biblioteca existe
      const library = await this.libraryService.findOne(
        selectedLibrary.libraryId,
      );
      if (!library) {
        throw new HttpException(
          'library.general.not_found',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userHasLibrary = await this.userService.userHasLibrary(
        user.id,
        selectedLibrary.libraryId,
      );
      if (0 == userHasLibrary[1]) {
        throw new HttpException(
          'user.general.does_not_have_access_to_library',
          HttpStatus.BAD_REQUEST,
        );
      }

      const libraryUser = await this.userService.getLibraryUser(
        user.id,
        selectedLibrary.libraryId,
      );
      if (!libraryUser) {
        throw new HttpException(
          'user.general.does_not_have_access_to_library',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (null == libraryUser.email_verified_at) {
        const token = this.authService.generateResetToken(
          user,
          'E',
          selectedLibrary.libraryId,
        );
        this.mailService.sendUserConfirmation(user, token, library.description);
        throw new HttpException(
          'user.general.not_verified_in_library',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.authService.generateLoginToken(
        user,
        selectedLibrary.libraryId,
      );
    } catch (error) {
      if (error.response && error.message)
        throw new HttpException(error.response, error.status);
      else throw new UnauthorizedException();
    }
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
      throw new HttpException('user.email.invalid', HttpStatus.BAD_REQUEST);

    // Verifica se usuário existe
    const user = await this.userService.findByEmail(sendResetPaswordDto.email);
    if (null == user)
      throw new HttpException(
        'user.email.does_not_exists',
        HttpStatus.BAD_REQUEST,
      );

    const token = this.authService.generateResetToken(user, 'S');
    await this.mailService.sendResetPasswordRequest(user, token);

    return {
      statusCode: 200,
      message: 'user.email.sent_successfully',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Body()
    resetPasswordDto: { newPassword: string; confirmNewPassword: string },
  ) {
    // O token é um "Bearer XXX", separa ele e retorna o token se ele for um Bearer
    const [type, token] = req.headers['authorization'].split(' ') ?? [];

    try {
      const payload: PayloadAuthDto = await this.jwtService.verifyAsync(token, {
        secret: process.env['SECRET'],
      });

      const currentUser: PayloadAuthDto = payload;

      // Pega o resetToken
      const resetToken = await this.authService.findOneToken(token);
      if (!resetToken)
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);

      if (resetToken.used)
        throw new HttpException(
          'auth.token.already_used',
          HttpStatus.BAD_REQUEST,
        );

      if ('S' != resetToken.type)
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);
      // Valida as senhas
      if (resetPasswordDto.newPassword != resetPasswordDto.confirmNewPassword)
        throw new HttpException(
          'user.password.different_password',
          HttpStatus.BAD_REQUEST,
        );

      // Se for um token de login, não deixa alterar a senha
      if (currentUser.logged) {
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);
      }

      // Valida o e-mail
      if ('' == currentUser.username)
        throw new HttpException(
          'user.password.update_error',
          HttpStatus.BAD_REQUEST,
        );

      // Verifica se usuário existe
      const user = await this.userService.findByEmail(currentUser.username);
      if (null == user)
        throw new HttpException(
          'user.password.update_error',
          HttpStatus.BAD_REQUEST,
        );

      const encriptedPasword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        10,
      );
      const updatedUser = await this.userService.updatePassword(
        user.id,
        encriptedPasword,
        currentUser.libraryId,
      );
      if (updatedUser.affected == 1) {
        // Atualiza o token como used
        this.authService.updateResetToken(+resetToken.id, true);
        return {
          statusCode: 200,
          message: 'user.password.update_successfully',
        };
      } else {
        throw new HttpException(
          'user.password.update_error',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error.response && error.message)
        throw new HttpException(error.response, error.status);
      else throw new UnauthorizedException();
    }
  }

  @Post('confirm-email')
  async confirmEmail(@Req() req: Request, @Body() data: { email: string }) {
    // Valida se o token foi usado
    const [type, token] = req.headers['authorization'].split(' ') ?? [];

    try {
      const payload: PayloadAuthDto = await this.jwtService.verifyAsync(token, {
        secret: process.env['SECRET'],
      });
      const reqUser: PayloadAuthDto = payload;

      // Pega o resetToken
      const resetToken = await this.authService.findOneToken(token);
      if (!resetToken)
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);

      if (resetToken.used)
        throw new HttpException(
          'auth.token.already_used',
          HttpStatus.BAD_REQUEST,
        );

      if ('E' != resetToken.type)
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);

      // Valida o e-mail
      const email = data.email;
      if (!email || '' == email) {
        throw new HttpException('user.email.invalid', HttpStatus.BAD_REQUEST);
      }

      // Valida o e-mail informado e o e-mail do token
      // Se for um token de login, não deixa alterar a senha
      if (reqUser.logged) {
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);
      }

      if (reqUser.username != email) {
        throw new HttpException('auth.token.invalid', HttpStatus.BAD_REQUEST);
      }

      // Valida se existe um usuário com o e-mail
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException(
          'user.email.does_not_exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.authService.updateResetToken(+resetToken.id, true);
      const updatedUser = await this.userService.confirmEmail(
        user.id,
        reqUser.libraryId,
      );
      if (updatedUser.affected == 1) {
        // Atualiza o token como used
        return {
          statusCode: 200,
          message: 'user.email.verified_successfully',
        };
      } else {
        throw new HttpException(
          'user.email.verified_error',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error.response && error.message)
        throw new HttpException(error.response, error.status);
      else throw new UnauthorizedException();
    }
  }
}
