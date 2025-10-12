import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockUserService } from './mocks/user.service.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService }
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
      verify_password: '1234'
    };

    // Mocka o retorno
    mockUserService.create.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com'
    });
    const result = await controller.create(user);

    expect(result).toEqual({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com'
    });
    expect(mockUserService.create).toHaveBeenCalledWith(user);
  });

  it('should return all users', async () => {
    // Cria os mocks e coloca no retorno
    const list = [
      {
        id: 1,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
      },
      {
        id: 2,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockUserService.findAll.mockResolvedValue(list);
    mockUserService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const findDto: FindUserDto = {
      limit: 2,
      page: 1
    };

    const result = await controller.findAll(
      findDto.page.toString(),
      findDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: list,
      count: quantity
    });
    findDto.page--;
    expect(mockUserService.findAll).toHaveBeenCalledWith(findDto);
  });

  it('Should return one user', async () => {
    // Cria um mock
    const user = {
      id: 2,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
    };

    // Insere os mocks nos serviços
    mockUserService.findOne.mockResolvedValue(user);

    // Cria o mock da consulta e consulta
    const id = 1;
    const result = await controller.findOne(id.toString());

    // Valida os dados
    expect(result).toEqual(user);
    expect(mockUserService.findOne).toHaveBeenCalledWith(id);
  });

  it('Should edit a user', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdateUserDto = {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      email: 'bbbevilaqua@gmail.com',
      update_password: false,
      current_password: '',
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockUserService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockUserService.findOne.mockResolvedValue(dto);

    const result = await controller.update(id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
  });

  it('Should remove a user', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockUserService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockUserService.findOne.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      email: 'bbbevilaqua@gmail.com'
    });

    const result = await controller.remove(id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Usuário deletado com sucesso.',
    });
    expect(mockUserService.remove).toHaveBeenCalledWith(id);
  });
});
