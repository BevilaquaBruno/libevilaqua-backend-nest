import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const updateResult = await this.genreService.update(+id, updateGenreDto);
    return updateResult.affected != 0
      ? Object.assign({ id: +id }, updateGenreDto)
      : { message: 'Ocorreu um erro ao atualizar o gênero' };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.genreService.remove(+id);
    return deleteResult.affected != 0
      ? {}
      : { message: 'Ocorreu um erro ao deletar o gênero' };
  }
}
