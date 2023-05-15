import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard)
  @Get('tags')
  tags(@Query('ids') tags: string) {
    const tagList: number[] = tags.split(',').map((v) => {
      return parseInt(v);
    });

    return this.bookService.findBooksFromTags(tagList);
  }

  @UseGuards(AuthGuard)
  @Get('genres')
  genres(@Query('ids') genres: string) {
    const genreList: number[] = genres.split(',').map((v) => {
      return parseInt(v);
    });

    return this.bookService.findBooksFromGenres(genreList);
  }

  @UseGuards(AuthGuard)
  @Get('publishers')
  publishers(@Query('ids') publishers: string) {
    const publisherList: number[] = publishers.split(',').map((v) => {
      return parseInt(v);
    });

    return this.bookService.findBooksFromPublishers(publisherList);
  }

  @UseGuards(AuthGuard)
  @Get('types')
  types(@Query('ids') types: string) {
    const typeList: number[] = types.split(',').map((v) => {
      return parseInt(v);
    });

    return this.bookService.findBooksFromTypes(typeList);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(+id);
    if (book === null) {
      throw new HttpException(
        'Não foi encontrado um livro com este código',
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const bookToUpdate = await this.bookService.findOne(+id);
    if (bookToUpdate === null) {
      throw new HttpException(
        'Este livro não existe, tente novamente',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.bookService.update(+id, updateBookDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
