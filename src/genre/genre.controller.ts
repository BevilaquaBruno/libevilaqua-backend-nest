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
  constructor(private readonly genreService: GenreService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    const newGenre = await this.genreService.create(createGenreDto);

    return {
      id: newGenre.id,
      description: newGenre.description
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findGenre: FindGenreDto = {
      limit: null,
      page: null,
    };

    findGenre.limit = limit == undefined ? 5 : parseInt(limit);
    findGenre.page =
      page == undefined ? 0 : findGenre.limit * (parseInt(page) - 1);

    return {
      data: await this.genreService.findAll(findGenre),
      count: await this.genreService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let genre: Genre = await this.genreService.findOne(+id);

    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND
      );
    return genre;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    let genre: Genre = await this.genreService.findOne(+id);
    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND
      );

    const updatedGenre = await this.genreService.update(+id, updateGenreDto);
    if (updatedGenre.affected == 1) {
      return {
        id: +id,
        description: updateGenreDto.description
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização do gênero.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let genre: Genre = await this.genreService.findOne(+id);
    if (null == genre)
      throw new HttpException(
        'Gênero não encontrado. Código do gênero: ' + id + '.',
        HttpStatus.NOT_FOUND
      );

    let deletedGenre = await this.genreService.remove(+id);
    if (deletedGenre.affected == 1) {
      throw new HttpException(
        'Gênero deletado com sucesso.',
        HttpStatus.OK
      );
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o gênero.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
