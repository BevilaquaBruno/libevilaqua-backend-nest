import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { States } from '../helpers/enum/States.enum';
import { UpdatePersonDto } from './dto/update-person.dto';
import { mockPersonService } from './mocks/person.service.mock';
import { FindPersonDto } from './dto/find-person.dto';

describe('PersonService', () => {
  let service: PersonService;
  const libraryId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PersonService, useValue: mockPersonService }],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a person', async () => {
    // Cria o mock
    const mock: CreatePersonDto = {
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    };

    const mockResolved: UpdatePersonDto = {
      id: 1,
      ...mock
    }

    // Coloca no resolve
    mockPersonService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create({
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    }, libraryId);

    expect(result).toEqual(mockResolved)
    expect(mockPersonService.create).toHaveBeenCalledWith({
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    }, libraryId);
  });

  it('Should return a list with all people', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockList = [
      {
        id: 1,
        name: 'Bruno Fernando Bevilaqua',
        document: '103.411.729-79',
        zip_code: '889700-055',
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
        document: '686.845.220-95',
        zip_code: '889700-055',
        state: States.SC,
        city: 'Concórdia',
        district: 'Linha São Paulo',
        street: 'Rua Sérgio Galvan',
        number: '15',
        obs: 'Meu próprio cadastro',
        email: "bruno.f.bevilaqua@gmail.com",
        phone: "49912345678"
      }
    ];
    mockPersonService.findAll.mockResolvedValue(mockList);

    // Cria a paginação e recebe o retorno;
    const findDto: FindPersonDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findDto, libraryId);

    // Valida os retornos
    expect(result).toEqual(mockList);
    expect(mockPersonService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 }, libraryId);
  });

  it('Should return a person', async () => {
    // Cria o mock
    const mock = {
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    };
    mockPersonService.findOne.mockResolvedValue(mock);

    // Consulta
    const result = await service.findOne(1, libraryId);

    // Valida os retornos
    expect(result).toEqual(mock);
    expect(mockPersonService.findOne).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should update a person', async () => {
    // Cria o mock
    const mock: UpdatePersonDto = {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    };
    mockPersonService.update.mockResolvedValue(mock);

    // Chama a edição do gênero
    const result = await service.update(1, {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    }, libraryId);

    // Valida o retorno
    expect(result).toEqual(mock);
    expect(mockPersonService.update).toHaveBeenCalledWith(1, {
      id: 1,
      name: 'Bruno Fernando Bevilaqua',
      document: '103.411.729-79',
      zip_code: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro',
      email: "bruno.f.bevilaqua@gmail.com",
      phone: "49912345678"
    }, libraryId);
  });

  it('Should remove a person', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDelete = {
      raw: [],
      affected: 1
    };
    mockPersonService.remove.mockResolvedValue(mockDelete);

    // Deleta
    const result = await service.remove(1, libraryId);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockPersonService.remove).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should return a count of people', async () => {
    // Coloca um mock no count
    mockPersonService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count(libraryId);

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockPersonService.count).toHaveBeenCalledWith(libraryId);
  });
});
