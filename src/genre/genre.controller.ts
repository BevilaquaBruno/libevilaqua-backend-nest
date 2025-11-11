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
  Req,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindGenreDto } from './dto/find-genre.dto';
import { Genre } from './entities/genre.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  // Cria um gênero
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createGenreDto: CreateGenreDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria o gênero novo e retorna o corpo
    const newGenre = await this.genreService.create(createGenreDto, reqUser.libraryId);

    return {
      id: newGenre.id,
      description: newGenre.description,
    };
  }

  // Retorna todos os gêneros
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number.', schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, example: '10', description: 'Limit of registers in the page.', schema: { default: 5 } })
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
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
      data: await this.genreService.findAll(findGenre, reqUser.libraryId),
      count: await this.genreService.count(reqUser.libraryId),
    };
  }

  // Retorna um gênero
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Genre id.' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id, reqUser.libraryId);

    if (null == genre)
      throw new HttpException(
        'genre.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    return genre;
  }

  // Atualiza um gênero
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Genre id.' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id, reqUser.libraryId);
    if (null == genre)
      throw new HttpException(
        'genre.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza o gênero e retorna erro ou sucesso
    const updatedGenre = await this.genreService.update(+id, updateGenreDto, reqUser.libraryId);
    if (updatedGenre.affected == 1) {
      return {
        id: +id,
        description: updateGenreDto.description,
      };
    } else {
      throw new HttpException(
        'genre.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta um gênero
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Genre id.' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta o gênero e retorna erro se não encontrou
    const genre: Genre = await this.genreService.findOne(+id, reqUser.libraryId);
    if (null == genre)
      throw new HttpException(
        'genre.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Deleta o gênero e retorna erro ou sucesso
    const deletedGenre = await this.genreService.remove(+id, reqUser.libraryId);
    if (deletedGenre.affected == 1) {
      return {
        statusCode: 200,
        message: 'genre.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'genre.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
