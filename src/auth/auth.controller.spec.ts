import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { mockJwtService } from '../../test/mocks/jwt.service.mock';
import { mockAuthService } from '../../test/mocks/auth.service.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call signIn and return a token', async () => {
    // Cria o dto do usuário para o controller e o retorno do token
    const dto = { email: 'bruno.f.bevilaqua@gmail.com', password: '123456' };
    const token = { access_token: 'jwt-token' };

    // Mocka o sign-in do auth service para ele retornar o token criado
    mockAuthService.signIn.mockResolvedValue(token);

    const result = await controller.signIn(dto);

    // Valida como o mock foi chamado e o resultado
    expect(mockAuthService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
    expect(result).toEqual(token);
  });

  it('Should call signIn and return UnauthorizedException', async () => {
    // Cria o dto do usuário para o controller, com a senha errada
    const dto = { email: 'bruno.f.bevilaqua@gmail.com', password: '1234' };

    // Faz com que o signIn retorna uma unauthorized exception
    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

    // Valida o retorno unauthorized
    await expect(controller.signIn(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('Should return { isValid: true } from authService', async () => {
    // Chama o controller
    const result = await controller.isValid();
    
    // Espera o resultado isValid
    expect(result).toEqual({ isValid: true });
  });

});
