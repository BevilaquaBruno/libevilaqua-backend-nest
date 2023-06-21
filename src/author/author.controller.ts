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
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findAuthor: FindAuthorDto = {
      page: null,
      limit: null,
    };

    findAuthor.limit = limit == undefined ? 0 : parseInt(limit);
    findAuthor.page =
      page == undefined ? 1 : findAuthor.limit * (parseInt(page) - 1);

    return this.authorService.findAll(findAuthor);
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
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/:authorId/books')
  async books(@Param('authorId') authorId: string) {
    const author = await this.authorService.findOne(+authorId);
    if (author === null) {
      throw new HttpException(
        'Não existe um author com esse código',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.bookService.findBooksFromAuthor(+authorId);
  }
}
