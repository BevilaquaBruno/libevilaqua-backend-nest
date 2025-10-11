import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { mockTagService } from './mocks/tag.service.mock';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';

describe('TagService', () => {
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: TagService, useValue: mockTagService }],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a tag', async () => {
    // Cria o mock
    const mock: CreateTagDto = {
      description: 'Tag description'
    };

    const mockResolved: UpdateTagDto = {
      id: 1,
      ...mock
    }

    // Coloca no resolve
    mockTagService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create({
      description: 'Tag description'
    });

    expect(result).toEqual(mockResolved)
    expect(mockTagService.create).toHaveBeenCalledWith({
      description: 'Tag description'
    });
  });

  it('Should return a list with all tags', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockList = [
      {
        id: 1,
        description: 'Tag description'
      },
      {
        id: 2,
        description: 'Tag description 2'
      }
    ];
    mockTagService.findAll.mockResolvedValue(mockList);

    // Cria a paginação e recebe o retorno;
    const findDto: FindTagDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findDto);

    // Valida os retornos
    expect(result).toEqual(mockList);
    expect(mockTagService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 });
  });

  it('Should return a tag', async () => {
    // Cria o mock
    const mock = {
      id: 1,
      description: 'Tag description'
    };
    mockTagService.findOne.mockResolvedValue(mock);

    // Consulta
    const result = await service.findOne(1);

    // Valida os retornos
    expect(result).toEqual(mock);
    expect(mockTagService.findOne).toHaveBeenCalledWith(1);
  });

  it('Should update a tag', async () => {
    // Cria o mock
    const mock: UpdateTagDto = {
      id: 1,
      description: 'Tag description'
    };
    mockTagService.update.mockResolvedValue(mock);

    // Chama a edição do gênero
    const result = await service.update(1, {
      id: 1,
      description: 'Tag description'
    });

    // Valida o retorno
    expect(result).toEqual(mock);
    expect(mockTagService.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: 'Tag description'
    });
  });

  it('Should remove a tag', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDelete = {
      raw: [],
      affected: 1
    };
    mockTagService.remove.mockResolvedValue(mockDelete);

    // Deleta
    const result = await service.remove(1);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockTagService.remove).toHaveBeenCalledWith(1);
  });

  it('Should return a count of tags', async () => {
    // Coloca um mock no count
    mockTagService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count();

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockTagService.count).toHaveBeenCalledWith();
  });
});
