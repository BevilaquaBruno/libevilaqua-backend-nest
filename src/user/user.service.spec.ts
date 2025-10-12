import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { mockUserService } from './mocks/user.service.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a user', async () => {
    // Cria o mock
    const mock: CreateUserDto = {
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234'
    };

    const mockResolved: UpdateUserDto = {
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234',
      update_password: true,
      current_password: '1234'
    };


    // Coloca no resolve
    mockUserService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create({
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234'
    });

    expect(result).toEqual(mockResolved)
    expect(mockUserService.create).toHaveBeenCalledWith({
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234'
    });
  });

  it('Should return a list with all users', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockList = [
      {
        id: 1,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
      },
      {
        id: 2,
        name: 'Bruno Fernando',
        email: 'bbbevilaqua@gmail.com',
      }
    ];
    mockUserService.findAll.mockResolvedValue(mockList);

    // Cria a paginação e recebe o retorno;
    const findDto: FindUserDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findDto);

    // Valida os retornos
    expect(result).toEqual(mockList);
    expect(mockUserService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 });
  });

  it('Should return a user', async () => {
    // Cria o mock
    const mock = {
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234'
    };
    mockUserService.findOne.mockResolvedValue(mock);

    // Consulta
    const result = await service.findOne(1);

    // Valida os retornos
    expect(result).toEqual(mock);
    expect(mockUserService.findOne).toHaveBeenCalledWith(1);
  });

  it('Should update a user', async () => {
    // Cria o mock
    const mock: UpdateUserDto = {
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234',
      update_password: false,
      current_password: '1234'
    };
    mockUserService.update.mockResolvedValue(mock);

    // Chama a edição do gênero
    const result = await service.update(1, {
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234',
      update_password: false,
      current_password: '1234'
    });

    // Valida o retorno
    expect(result).toEqual(mock);
    expect(mockUserService.update).toHaveBeenCalledWith(1, {
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: '1234',
      verify_password: '1234',
      update_password: false,
      current_password: '1234'
    });
  });

  it('Should remove a user', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDelete = {
      raw: [],
      affected: 1
    };
    mockUserService.remove.mockResolvedValue(mockDelete);

    // Deleta
    const result = await service.remove(1);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockUserService.remove).toHaveBeenCalledWith(1);
  });

  it('Should return a count of users', async () => {
    // Coloca um mock no count
    mockUserService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count();

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockUserService.count).toHaveBeenCalledWith();
  });


  it('Should return one user with password', async () => {
    // Coloca um mock no count
    mockUserService.findOneWithPassword.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: 'senha-criptografada'
    });

    // Chama o count
    const result = await service.findOneWithPassword(1);

    // Valida os retornos
    expect(result).toEqual({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: 'senha-criptografada'
    });
    expect(mockUserService.findOneWithPassword).toHaveBeenCalledWith(1);
  });

  it('Should return user by email', async () => {
    // Coloca um mock no count
    mockUserService.findByEmail.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: 'senha-criptografada'
    });

    // Chama o count
    const result = await service.findByEmail('bbbevilaqua@gmail.com');

    // Valida os retornos
    expect(result).toEqual({
      id: 1,
      name: 'Bruno Fernando',
      email: 'bbbevilaqua@gmail.com',
      password: 'senha-criptografada'
    });
    expect(mockUserService.findByEmail).toHaveBeenCalledWith('bbbevilaqua@gmail.com');
  });

  /**
   * findOneWithPassword: jest.fn(),
  findByEmail: jest.fn(),
   */
});
