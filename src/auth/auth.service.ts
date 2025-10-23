import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { ResetToken } from 'src/reset-token/entities/reset-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken) private resetTokenRepository: Repository<ResetToken>,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

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

  async generateResetToken(user: User) {
    const token = this.jwtService.sign({ username: user.email, sub: user.id }, { expiresIn: '12h' });
    
    await this.resetTokenRepository.save({
      userId: user.id.toString(),
      token,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    });

    return token;
  }

  async findOneToken(token: string): Promise<ResetToken> {
    return this.resetTokenRepository.findOneBy({ token: token });
  }

  async updateResetToken(id: number, used: boolean) {
    return await this.resetTokenRepository.update(id, { used: used });
  }
}
