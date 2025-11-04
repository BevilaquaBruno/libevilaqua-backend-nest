import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { mockJwtService } from './mocks/jwt.service.mock';
import { mockAuthService } from './mocks/auth.service.mock';
import { UnauthorizedException } from '@nestjs/common';
import { MainAuthDto } from './dto/main-auth.dto';
import { mockUserService } from '../user/mocks/user.service.mock';
import { UserService } from '../user/user.service';
import { mockMailService } from '../mail/mock/mail.service.mock';
import { MailService } from '../mail/mail.service';
import { mockLibraryService } from '../library/mock/library.service.mock';
import { LibraryService } from '../library/library.service';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: MailService, useValue: mockMailService },
        { provide: LibraryService, useValue: mockLibraryService },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call signIn and return libraries', async () => {
    // Cria o dto do usuário para o controller e o retorno do token
    const dto: MainAuthDto = { email: 'bruno.f.bevilaqua@gmail.com', password: '123456' };
    const token = { access_token: 'jwt-token' };
    const password = await bcrypt.hash('123', 10);
    
    mockUserService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'bruno.f.bevilaqua@gmail.com',
      password: password,
    });
    mockLibraryService.getLibrariesFromuser.mockResolvedValue([{ id: 1, description: "Library" }]);
    mockJwtService.sign.mockResolvedValue('jwt-token');

    // Mocka o sign-in do auth service para ele retornar o token criado
    mockAuthService.signIn.mockResolvedValue(true);

    const result = await controller.signIn(dto);

    // Valida como o mock foi chamado e o resultado
    expect(mockAuthService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
    expect(mockLibraryService.getLibrariesFromuser).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      id: 1,
      name: undefined,
      email: 'bruno.f.bevilaqua@gmail.com',
      password: mockJwtService.sign({ password: '123' }, { expiresIn: '5m' }),
      libraries: [{ id: 1, description: "Library" }],
    });
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
