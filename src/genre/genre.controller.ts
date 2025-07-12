import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindGenreDto } from './dto/find-genre.dto';
import { Genre } from './entities/genre.entity';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // Cria um gênero
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    // Cria o gênero novo e retorna o corpo
    const newGenre = await this.genreService.create(createGenreDto);

    return {
      id: newGenre.id,
      description: newGenre.description,
    };
  }

  // Retorna todos os gêneros
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    // Cria a paginação
    const findGenre: FindGenreDto = {
      limit: null,
      page: null,
    };

    // Define a paginação
    findGenre.limit = limit == undefined ? 5 : parseInt(limit);
    findGenre.page =
      page == undefined ? 0 : findGenre.limit * (parseInt(page) - 1);

    return {
      data: await this.genreService.findAll(findGenre),
      count: await this.genreService.count(),
    };
  }

  // Retorna um gênero
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id);

    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return genre;
  }

  // Atualiza um gênero
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id);
    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza o gênero e retorna erro ou sucesso
    const updatedGenre = await this.genreService.update(+id, updateGenreDto);
    if (updatedGenre.affected == 1) {
      return {
        id: +id,
        description: updateGenreDto.description,
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização do gênero.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta um gênero
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id);
    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Deleta o gênero e retorna erro ou sucesso
    const deletedGenre = await this.genreService.remove(+id);
    if (deletedGenre.affected == 1) {
      throw new HttpException('Gênero deletado com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o gênero.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
