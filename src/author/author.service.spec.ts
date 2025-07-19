import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from './author.service';
import { mockAuthorService } from './mocks/author.service.mock';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { FindAuthorDto } from './dto/find-author.dto';

describe('AuthorService', () => {
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthorService, useValue: mockAuthorService }
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create an author', async () => {
    // Cria um mock de retorno e coloca ele no Create Author
    const mockAuthor: CreateAuthorDto = {
      name: 'New Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    };
    const mockAuthorResolved: UpdateAuthorDto = {
      id: 1,
      ...mockAuthor
    };
    mockAuthorService.create.mockResolvedValue(mockAuthorResolved);

    // Chama a criação do Author
    const result = await service.create({
      name: 'New Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    });

    // Valida o retorno e a chamada
    expect(result).toEqual(mockAuthorResolved);
    expect(mockAuthorService.create).toHaveBeenCalledWith({
      name: 'New Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    });
  });

  it('Should return a list with all authors', async () => {
    // Cria o mock da lista de autores e coloca no resolve do findAll para os autores
    const mockAuthorList = [
      {
        id: 1,
        name: 'New Author name',
        birth_date: new Date('2000-01-01'),
        death_date: new Date('2025-01-01'),
        bio: 'Here is the author bio, a long place to put some text'
      },
      {
        id: 2,
        name: 'New Author name 2',
        birth_date: new Date('2000-01-01'),
        death_date: new Date('2025-01-01'),
        bio: 'Here is the author bio, a long place to put some text 2'
      }
    ];
    mockAuthorService.findAll.mockResolvedValue(mockAuthorList);

    // Cria a paginação e recebe o retorno
    const findAuthor: FindAuthorDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findAuthor);

    // Valida os retornos
    expect(result).toEqual(mockAuthorList);
    expect(mockAuthorService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 });
  });

  it('Should return one author', async () => {
    // Cria o mock do usuário e coloca no resolve do findOne
    const mockAuthor = {
      id: 1,
      name: 'New Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    };
    mockAuthorService.findOne.mockResolvedValue(mockAuthor);

    // Consulta
    const result = await service.findOne(1);

    // Valida os retornos
    expect(result).toEqual(mockAuthor);
    expect(mockAuthorService.findOne).toHaveBeenCalledWith(1)
  });

  it('Should update and author', async () => {
    // Cria um mock de retorno e coloca ele no Update Author
    const mockAuthor: UpdateAuthorDto = {
      id: 1,
      name: 'Update Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    };
    mockAuthorService.update.mockResolvedValue(mockAuthor);

    // Chama a edição do Author
    const result = await service.update(1, {
      id: 1,
      name: 'Update Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    });

    // Valida o retorno e a chamada
    expect(result).toEqual(mockAuthor);
    expect(mockAuthorService.update).toHaveBeenCalledWith(1, {
      id: 1,
      name: 'Update Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'Here is the author bio, a long place to put some text'
    });
  });

  it('Should remove an author', async () => {
    // Cria o mock de retorno e coloca no delete Author
    const mockDeleteAuthor = {
      raw: [],
      affected: 1
    };
    mockAuthorService.remove.mockResolvedValue(mockDeleteAuthor);

    // Deleta o autor
    const result = await service.remove(1);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockAuthorService.remove).toHaveBeenCalledWith(1);
  });

  it('Should return a count of authors', async () => {
    // Coloca um mock no count de autores
    mockAuthorService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count();

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockAuthorService.count).toHaveBeenCalledWith();
  });
});
