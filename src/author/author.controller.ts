import { Length } from 'class-validator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookService } from 'src/book/book.service';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAuthorDto } from './dto/find-author.dto';
import { FindAuthorBooksDto } from './dto/find-author-books.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findAuthor: FindAuthorDto = {
      page: null,
      limit: null,
    };

    findAuthor.limit = limit == undefined ? 5 : parseInt(limit);
    findAuthor.page =
      page == undefined ? 0 : findAuthor.limit * (parseInt(page) - 1);

    return {
      data: await this.authorService.findAll(findAuthor),
      count: await this.authorService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const books = await this.bookService.findBooksFromAuthor({
      page: 1,
      limit: 1,
      authorId: +id,
    });
    if (books.length === 0) return this.authorService.remove(+id);
    else
      throw new HttpException(
        'Existem livros vinculados a esse autor, não é possível excluir.',
        HttpStatus.NOT_FOUND,
      );
  }

  @UseGuards(AuthGuard)
  @Get('/:authorId/books')
  async books(
    @Param('authorId') authorId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const findAuthorBooks: FindAuthorBooksDto = {
      page: null,
      limit: null,
      authorId: null,
    };

    const author = await this.authorService.findOne(+authorId);
    if (author === null) {
      throw new HttpException(
        'Não existe um author com esse código',
        HttpStatus.NOT_FOUND,
      );
    }
    findAuthorBooks.authorId = +authorId;
    findAuthorBooks.limit = limit == undefined ? 5 : parseInt(limit);
    findAuthorBooks.page =
      page == undefined ? 0 : findAuthorBooks.limit * (parseInt(page) - 1);

    return this.bookService.findBooksFromAuthor(findAuthorBooks);
  }
}
