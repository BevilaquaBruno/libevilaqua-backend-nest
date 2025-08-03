import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { mockGenreService } from './mocks/genre.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { FindGenreDto } from './dto/find-genre.dto';

describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: GenreService, useValue: mockGenreService }
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new genre', async () => {
    // Cria o dto do gênero
    const genreDto: CreateGenreDto = {
      description: 'New Genre'
    }

    // Mocka o retorno
    mockGenreService.create.mockResolvedValue({
      id: 1,
      ...genreDto
    });
    const result = await controller.create(genreDto);

    expect(result).toEqual({
      id: 1,
      ...genreDto
    });
    expect(mockGenreService.create).toHaveBeenCalledWith(genreDto);
  });

  it('should return all genres', async () => {
    // Cria os mocks dos autores e coloca no retorno
    const genreList: UpdateGenreDto[] = [
      {
        id: 1,
        description: 'New genre 1'
      },
      {
        id: 2,
        description: 'New genre 2'
      },
    ];
    const genreQuantity = genreList.length;

    // insere os mocks
    mockGenreService.findAll.mockResolvedValue(genreList);
    mockGenreService.count.mockResolvedValue(genreQuantity);

    // Cria a paginação e requisita
    const findGenreDto: FindGenreDto = {
      limit: 2,
      page: 1
    };

    const result = await controller.findAll(
      findGenreDto.page.toString(),
      findGenreDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: genreList,
      count: genreQuantity
    });
    findGenreDto.page--;
    expect(mockGenreService.findAll).toHaveBeenCalledWith(findGenreDto);
  });

  it('Should return one genre', async () => {
    // Cria um mock para o gênero
    const genre: UpdateGenreDto = {
      id: 1,
      description: 'New genre'
    };

    // Insere os mocks nos serviços
    mockGenreService.findOne.mockResolvedValue(genre);

    // Cria o mock da consulta e consulta o gênero
    const genreId = 1;
    const result = await controller.findOne(genreId.toString());

    // Valida os dados
    expect(result).toEqual(genre);
    expect(mockGenreService.findOne).toHaveBeenCalledWith(genreId);
  });

  it('Should edit a genre', async () => {
    // Cria o dto do gênero
    const genreId = 1;
    const genreDto: UpdateGenreDto = {
      id: 1,
      description: 'Genre edited'
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockGenreService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockGenreService.findOne.mockResolvedValue(genreDto);

    const result = await controller.update(genreId.toString(), genreDto);

    expect(result).toEqual(genreDto);
    expect(mockGenreService.update).toHaveBeenCalledWith(genreId, genreDto);
  });

  it('Should remove a genre', async () => {
    // Cria o id
    const genreId = 1;

    // Mocka o resultado
    mockGenreService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockGenreService.findOne.mockResolvedValue({
      id: genreId,
      description: 'New genre'
    });

    const result = await controller.remove(genreId.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Gênero deletado com sucesso.',
    });
    expect(mockGenreService.remove).toHaveBeenCalledWith(genreId);
  });
});
