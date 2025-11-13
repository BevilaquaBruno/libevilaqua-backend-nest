import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { ResetToken } from '../reset-token/entities/reset-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadAuthDto } from './dto/payload-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
    isPasswordEncripted: boolean = false,
  ) {
    // Localiza o usuário pelo e-mail
    const user = await this.userService.findByEmail(email);

    // Compara a senha informada com a senha do banco
    let isValid = true;
    if (isPasswordEncripted) {
      isValid = password == user.password ? true : false;
    } else {
      isValid = await bcrypt.compare(password, user.password);
    }
    if (!isValid) {
      throw new UnauthorizedException();
    }

    // retorna as bibliotecas do usuário
    return isValid;
  }

  generateLoginToken(user: User, libraryId: number) {
    const payload: PayloadAuthDto = {
      username: user.email,
      sub: user.id,
      logged: true,
      libraryId: libraryId,
    };
    // Retorna um token com base no payload
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }

  generateResetToken(user: User, tokenType: 'E' | 'S', libraryId = 0) {
    const payload: PayloadAuthDto = {
      username: user.email,
      sub: user.id,
      logged: false,
      libraryId: libraryId,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '12h' });

    this.resetTokenRepository.save({
      userId: user.id.toString(),
      token,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      type: tokenType,
    });

    return token;
  }

  findOneToken(token: string): Promise<ResetToken> {
    return this.resetTokenRepository.findOneBy({ token: token });
  }

  updateResetToken(id: number, used: boolean) {
    return this.resetTokenRepository.update(id, { used: used });
  }
}
