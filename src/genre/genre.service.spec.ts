import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { mockGenreService } from './mocks/genre.service.mock';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { FindGenreDto } from './dto/find-genre.dto';

describe('GenreService', () => {
  let service: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: GenreService, useValue: mockGenreService }],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a gente', async () => {
    // Cria o mock
    const mockGenre: CreateGenreDto = {
      description: 'New Genre'
    };

    const mockGenreResolved: UpdateGenreDto = {
      id: 1,
      ...mockGenre
    }

    // Coloca no resolve
    mockGenreService.create.mockResolvedValue(mockGenreResolved);

    // Chama e valida
    const result = await service.create({
      description: 'New Genre'
    });

    expect(result).toEqual(mockGenreResolved)
    expect(mockGenreService.create).toHaveBeenCalledWith({ description: 'New Genre' });
  });

  it('Should return a list with all genres', async () => {
    // Cria o mock da lista de gêneros e coloca no resolve
    const mockGenreList = [
      {
        id: 1,
        description: 'Genre 1'
      },
      {
        id: 2,
        description: 'Genre 2'
      }
    ];
    mockGenreService.findAll.mockResolvedValue(mockGenreList);

    // Cria a paginação e recebe o retorno;
    const findGenreDto: FindGenreDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findGenreDto);

    // Valida os retornos
    expect(result).toEqual(mockGenreList);
    expect(mockGenreService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 });
  });

  it('Should return a genre', async () => {
    // Cria o mock do gênero
    const mockGenre = {
      id: 1,
      description: 'This genre'
    };
    mockGenreService.findOne.mockResolvedValue(mockGenre);

    // Consulta
    const result = await service.findOne(1);

    // Valida os retornos
    expect(result).toEqual(mockGenre);
    expect(mockGenreService.findOne).toHaveBeenCalledWith(1);
  });

  it('Should update a genre', async () => {
    // Cria o mock do gênero
    const mockGenre: UpdateGenreDto = {
      id: 1,
      description: 'Update Genre'
    };
    mockGenreService.update.mockResolvedValue(mockGenre);

    // Chama a edição do gênero
    const result = await service.update(1, { id: 1, description: 'Update Genre' });

    // Valida o retorno
    expect(result).toEqual(mockGenre);
    expect(mockGenreService.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: 'Update Genre'
    });
  });

  it('Should remove a genre', async () => {
    // Cria o mock de retorno e coloca no delete genre
    const mockDeleteGenre = {
      raw: [],
      affected: 1
    };
    mockGenreService.remove.mockResolvedValue(mockDeleteGenre);

    // Deleta o autor
    const result = await service.remove(1);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockGenreService.remove).toHaveBeenCalledWith(1);
  });

  it('Should return a count of genres', async () => {
    // Coloca um mock no count de autores
    mockGenreService.count.mockResolvedValue(1);

    // Chama o count
    const result = await service.count();

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockGenreService.count).toHaveBeenCalledWith();
  });
});
