import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from './type.service';
import { mockTypeService } from './mocks/type.service.mock';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { FindTypeDto } from './dto/find-type.dto';

describe('TypeService', () => {
  let service: TypeService;
  const libraryId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: TypeService, useValue: mockTypeService }],
    }).compile();

    service = module.get<TypeService>(TypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a type', async () => {
    // Cria o mock
    const mock: CreateTypeDto = {
      description: 'Type description',
    };

    const mockResolved: UpdateTypeDto = {
      id: 1,
      ...mock,
    };

    // Coloca no resolve
    mockTypeService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create(
      {
        description: 'Type description',
      },
      libraryId,
    );

    expect(result).toEqual(mockResolved);
    expect(mockTypeService.create).toHaveBeenCalledWith(
      {
        description: 'Type description',
      },
      libraryId,
    );
  });

  it('Should return a list with all types', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockList = [
      {
        id: 1,
        description: 'Type description',
      },
      {
        id: 2,
        description: 'Type description 2',
      },
    ];
    mockTypeService.findAll.mockResolvedValue(mockList);

    // Cria a paginação e recebe o retorno;
    const findDto: FindTypeDto = {
      limit: 2,
      page: 1,
    };
    const result = await service.findAll(findDto, libraryId);

    // Valida os retornos
    expect(result).toEqual(mockList);
    expect(mockTypeService.findAll).toHaveBeenCalledWith(
      { limit: 2, page: 1 },
      libraryId,
    );
  });

  it('Should return a type', async () => {
    // Cria o mock
    const mock = {
      id: 1,
      description: 'Type description',
    };
    mockTypeService.findOne.mockResolvedValue(mock);

    // Consulta
    const result = await service.findOne(1, libraryId);

    // Valida os retornos
    expect(result).toEqual(mock);
    expect(mockTypeService.findOne).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should update a type', async () => {
    // Cria o mock
    const mock: UpdateTypeDto = {
      id: 1,
      description: 'Type description',
    };
    mockTypeService.update.mockResolvedValue(mock);

    // Chama a edição do gênero
    const result = await service.update(
      1,
      {
        id: 1,
        description: 'Type description',
      },
      libraryId,
    );

    // Valida o retorno
    expect(result).toEqual(mock);
    expect(mockTypeService.update).toHaveBeenCalledWith(
      1,
      {
        id: 1,
        description: 'Type description',
      },
      libraryId,
    );
  });

  it('Should remove a type', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDelete = {
      raw: [],
      affected: 1,
    };
    mockTypeService.remove.mockResolvedValue(mockDelete);

    // Deleta
    const result = await service.remove(1, libraryId);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockTypeService.remove).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should return a count of types', async () => {
    // Coloca um mock no count
    mockTypeService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count(libraryId);

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockTypeService.count).toHaveBeenCalledWith(libraryId);
  });
});
