import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PayloadAuthDto } from './dto/payload-auth.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Pega a request e extrai o token do header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Valida o token com base no SECRET que está no .env
      const payload: PayloadAuthDto = await this.jwtService.verifyAsync(token, {
        secret: process.env['SECRET'],
      });

      // Se não for um token de login, não deixa prosseguir
      if (!payload.logged)
        throw new UnauthorizedException();

      // Coloca o user dentro do request pra ser usado na regra de negócio
      request['user'] = payload;

      // Retorna true ou unauthorized exception
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // O token é um "Bearer XXX", separa ele e retorna o token se ele for um Bearer
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
