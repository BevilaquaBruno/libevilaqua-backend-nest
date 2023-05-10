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
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
