import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { mockPersonService } from './mocks/person.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { CreatePersonDto } from './dto/create-person.dto';
import { States } from '../helpers/enum/States.enum';
import { UpdatePersonDto } from './dto/update-person.dto';
import { FindPersonDto } from './dto/find-person.dto';

describe('PersonController', () => {
  let controller: PersonController;
  const libraryId = 1;
  const req = { user: { libraryId: 1, logged: true, sub: 1, username: 'bruno.f.bevilaqua@gmail.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: PersonService, useValue: mockPersonService }
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new person', async () => {
    // Cria o dto
    const person: CreatePersonDto = {
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    }

    // Mocka o retorno
    mockPersonService.create.mockResolvedValue({
      id: 1,
      ...person
    });
    const result = await controller.create(req, person);

    expect(result).toEqual({
      id: 1,
      ...person
    });
    expect(mockPersonService.create).toHaveBeenCalledWith(person, libraryId);
  });

  it('should return all people', async () => {
    // Cria os mocks e coloca no retorno
    const list: UpdatePersonDto[] = [
      {
        id: 1,
        name: 'Bruno Fernando Bevilaqua',
        cpf: '103.411.729-79',
        cep: '889700-055',
        state: States.SC,
        city: 'Concórdia',
        district: 'Linha São Paulo',
        street: 'Rua Sérgio Galvan',
        number: '15',
        obs: 'Meu próprio cadastro',
        email: "bruno.f.bevilaqua@gmail.com",
        phone: "49912345678"
      },
      {
        id: 2,
        name: 'Bruno Fernando Bevilaqua',
        cpf: '686.845.220-95',
        cep: '889700-055',
        state: States.SC,
        city: 'Concórdia',
        district: 'Linha São Paulo',
        street: 'Rua Sérgio Galvan',
        number: '15',
        obs: 'Meu próprio cadastro',
        email: "bruno.f.bevilaqua@gmail.com",
        phone: "49912345678"
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockPersonService.findAll.mockResolvedValue(list);
    mockPersonService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const FindPersonDto: FindPersonDto = {
      limit: 2,
      page: 1
    };

    const result = await controller.findAll(
      req,
      FindPersonDto.page.toString(),
      FindPersonDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: list,
      count: quantity
    });
    FindPersonDto.page--;
    expect(mockPersonService.findAll).toHaveBeenCalledWith(FindPersonDto, libraryId);
  });

  it('Should return one people', async () => {
    // Cria um mock
    const person: UpdatePersonDto = {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    };

    // Insere os mocks nos serviços
    mockPersonService.findOne.mockResolvedValue(person);

    // Cria o mock da consulta e consulta o gênero
    const id = 1;
    const result = await controller.findOne(req, id.toString());

    // Valida os dados
    expect(result).toEqual(person);
    expect(mockPersonService.findOne).toHaveBeenCalledWith(id, libraryId);
  });

  it('Should edit a person', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdatePersonDto = {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockPersonService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockPersonService.findOne.mockResolvedValue(dto);

    const result = await controller.update(req, id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockPersonService.update).toHaveBeenCalledWith(id, dto, libraryId);
  });

  it('Should remove a person', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockPersonService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockPersonService.findOne.mockResolvedValue({
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    });

    const result = await controller.remove(req, id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'person.general.deleted_with_success',
    });
    expect(mockPersonService.remove).toHaveBeenCalledWith(id, libraryId);
  });
});
