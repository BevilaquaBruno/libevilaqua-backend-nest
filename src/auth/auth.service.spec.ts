import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mockUserService } from '../user/mocks/user.service.mock';
import { mockJwtService } from './mocks/jwt.service.mock';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResetToken } from '../reset-token/entities/reset-token.entity';
import { mockResetTokenService } from '../reset-token/mock/reset-token.service.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(ResetToken),
          useValue: mockResetTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should validate user with correct e-mail and password', async () => {
    // Cria um mock de retorno que o user service faria
    const mockUser = {
      id: 1,
      email: 'bruno.f.bevilaqua@gmail.com',
      password: await bcrypt.hash('123', 10),
    };

    /**
     * Mocka esse retorno
     * Quando o service.signin abaixo foi chamado, o findByEmail dentro irá retornar o mock
     */
    mockUserService.findByEmail.mockResolvedValue(mockUser);
    const result = await service.signIn('bruno.f.bevilaqua@gmail.com', '123');

    // valida os retornos
    expect(result).toBe(true);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith('bruno.f.bevilaqua@gmail.com');
  });

  it('Should validate user with wrong e-mail and password', async () => {
    // Cria o mock de retorno do user service
    const mockUser = {
      id: 1,
      email: 'bruno.f.bevilaqua@gmail.com',
      password: await bcrypt.hash('123', 10),
    };

    mockUserService.findByEmail.mockResolvedValue(mockUser);

    // Chama o signin com a senha errada
    await expect(
      service.signIn('bruno.f.bevilaqua@gmail.com', 'senhaErrada')
    ).rejects.toThrow(UnauthorizedException);
  });

});
