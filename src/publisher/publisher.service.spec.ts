import { Test, TestingModule } from '@nestjs/testing';
import { PublisherService } from './publisher.service';
import { mockPublisherService } from './mocks/publisher.service.mock';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { FindPublisherDto } from './dto/find-publisher.dto';

describe('PublisherService', () => {
  let service: PublisherService;
  const libraryId = 1

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PublisherService, useValue: mockPublisherService }],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a publisher', async () => {
    // Cria o mock
    const mock: CreatePublisherDto = {
      name: 'Editora cadastrada',
      country: 'Brasil'
    };

    const mockResolved: UpdatePublisherDto = {
      id: 1,
      ...mock
    }

    // Coloca no resolve
    mockPublisherService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create({
      name: 'Editora cadastrada',
      country: 'Brasil'
    }, libraryId);

    expect(result).toEqual(mockResolved)
    expect(mockPublisherService.create).toHaveBeenCalledWith({
      name: 'Editora cadastrada',
      country: 'Brasil'
    }, libraryId);
  });

  it('Should return a list with all publishers', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockList = [
      {
        id: 1,
        name: 'Editora cadastrada',
        country: 'Brasil'
      },
      {
        id: 2,
        name: 'Nova Editora cadastrada',
        country: 'Brasil'
      }
    ];
    mockPublisherService.findAll.mockResolvedValue(mockList);

    // Cria a paginação e recebe o retorno;
    const findDto: FindPublisherDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findDto, libraryId);

    // Valida os retornos
    expect(result).toEqual(mockList);
    expect(mockPublisherService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 }, libraryId);
  });

  it('Should return a publisher', async () => {
    // Cria o mock
    const mock = {
      name: 'Editora cadastrada',
      country: 'Brasil'
    };
    mockPublisherService.findOne.mockResolvedValue(mock);

    // Consulta
    const result = await service.findOne(1, libraryId);

    // Valida os retornos
    expect(result).toEqual(mock);
    expect(mockPublisherService.findOne).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should update a publisher', async () => {
    // Cria o mock
    const mock: UpdatePublisherDto = {
      id: 1,
      name: 'Editora cadastrada',
      country: 'Brasil'
    };
    mockPublisherService.update.mockResolvedValue(mock);

    // Chama a edição do gênero
    const result = await service.update(1, {
      id: 1,
      name: 'Editora cadastrada',
      country: 'Brasil'
    }, libraryId);

    // Valida o retorno
    expect(result).toEqual(mock);
    expect(mockPublisherService.update).toHaveBeenCalledWith(1, {
      id: 1,
      name: 'Editora cadastrada',
      country: 'Brasil'
    }, libraryId);
  });

  it('Should remove a publisher', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDelete = {
      raw: [],
      affected: 1
    };
    mockPublisherService.remove.mockResolvedValue(mockDelete);

    // Deleta
    const result = await service.remove(1, libraryId);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockPublisherService.remove).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should return a count of publishers', async () => {
    // Coloca um mock no count
    mockPublisherService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count(libraryId);

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockPublisherService.count).toHaveBeenCalledWith(libraryId);
  });
});
