import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockUserService } from './mocks/user.service.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { MailService } from '../mail/mail.service';
import { mockMailService } from '../mail/mocks/mail.service.mock';
import { AuthService } from '../auth/auth.service';
import { mockAuthService } from '../auth/mocks/auth.service.mock';
import { LibraryService } from '../library/library.service';
import { mockLibraryService } from '../library/mocks/library.service.mock';
import { Languages } from '../helpers/enum/Languages.enum';

describe('UserController', () => {
  let controller: UserController;
  const libraryId = 1;
  const req = {
    user: {
      libraryId: 1,
      logged: true,
      sub: 1,
      username: 'bruno.f.bevilaqua@gmail.com',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: MailService, useValue: mockMailService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LibraryService, useValue: mockLibraryService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new user', async () => {
    // Cria o dto
    const user: CreateUserDto = {
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234',
      language: Languages.EN,
    };

    // Mocka o retorno
    mockUserService.create.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      language: Languages.EN,
    });
    mockLibraryService.findOne.mockResolvedValue({
      id: 1,
      description: 'Biblioteca um',
    });
    mockUserService.createLibraryUser.mockResolvedValue({
      id: 1,
      library: { id: 1 },
      user: { id: 1 },
    });
    const result = await controller.create(req, user);

    expect(result).toEqual({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      language: Languages.EN,
    });
    expect(mockUserService.create).toHaveBeenCalled();
    expect(mockLibraryService.findOne).toHaveBeenCalledWith(libraryId);
    expect(mockUserService.createLibraryUser).toHaveBeenCalledWith(
      1,
      libraryId,
    );
  });

  it('should return all users', async () => {
    // Cria os mocks e coloca no retorno
    const list = [
      {
        id: 1,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
        language: Languages.EN,
      },
      {
        id: 2,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
        language: Languages.EN,
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockUserService.findAll.mockResolvedValue(list);
    mockUserService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const findDto: FindUserDto = {
      limit: 2,
      page: 1,
    };

    const result = await controller.findAll(
      req,
      findDto.page.toString(),
      findDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: list,
      count: quantity,
    });
    findDto.page--;
    expect(mockUserService.findAll).toHaveBeenCalledWith(findDto, libraryId);
  });

  it('Should return one user', async () => {
    // Cria um mock
    const user = {
      id: 2,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      language: Languages.EN,
    };

    // Insere os mocks nos serviços
    mockUserService.findOne.mockResolvedValue(user);

    // Cria o mock da consulta e consulta
    const id = 1;
    const result = await controller.findOne(req, id.toString());

    // Valida os dados
    expect(result).toEqual(user);
    expect(mockUserService.findOne).toHaveBeenCalledWith(id, libraryId);
  });

  it('Should edit a user', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdateUserDto = {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      email: 'bbbevilaqua@gmail.com',
      language: Languages.EN,
      update_password: false,
      current_password: '',
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockUserService.update.mockResolvedValue({
      raw: [],
      affected: 1,
    });
    mockLibraryService.findOne.mockResolvedValue({
      id: 1,
      description: 'Biblioteca um',
    });
    mockUserService.findOne.mockResolvedValue(dto);

    const result = await controller.update(req, id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockUserService.update).toHaveBeenCalledWith(id, {
      id: 1,
      email: 'bbbevilaqua@gmail.com',
      name: 'Bruno Fernando Bevilaqua',
      language: Languages.EN,
    });
    expect(mockLibraryService.findOne).toHaveBeenCalledWith(libraryId);
  });

  it('Should remove a user', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockUserService.remove.mockResolvedValue({
      raw: [],
      affected: 1,
    });
    mockUserService.findOne.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      email: 'bbbevilaqua@gmail.com',
      language: Languages.EN,
    });

    const result = await controller.remove(req, id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'user.general.deleted_with_success',
    });
    expect(mockUserService.remove).toHaveBeenCalledWith(id);
  });
});
