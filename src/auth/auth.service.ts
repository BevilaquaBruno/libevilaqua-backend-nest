import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    // Localiza o usuário pelo e-mail
    const user = await this.userService.findByEmail(email);

    // Compara a senha informada com a senha do banco
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.email, sub: user.id };
    // Retorna um token com base no payload
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
