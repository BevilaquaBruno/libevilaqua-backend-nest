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
import { FindBookDto } from './dto/find-book.dto';
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
  async findAll(
    @Query('genres') genres: string,
    @Query('tags') tags: string,
    @Query('publishers') publishers: string,
    @Query('types') types: string,
    @Query('authors') authors: string,
    @Query('release_year') release_year: string,
    @Query('number_pages') number_pages: string,
    @Query('isbn') isbn: string,
    @Query('edition') edition: string,
    @Query('title') title: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const findBook: FindBookDto = {
      typeList: null,
      publisherList: null,
      tagList: null,
      genreList: null,
      authorList: null,
      release_year: null,
      number_pages: null,
      isbn: null,
      edition: null,
      title: null,
      limit: null,
      page: null,
    };

    //turn typeList in number[]
    if (types !== undefined) {
      findBook.typeList = types.split(',').map((v) => {
        return parseInt(v);
      });
    }

    //turn publisherList in number[]
    if (publishers !== undefined) {
      findBook.publisherList = publishers.split(',').map((v) => {
        return parseInt(v);
      });
    }

    //turn taglist in number[]
    if (tags !== undefined) {
      findBook.tagList = tags.split(',').map((v) => {
        return parseInt(v);
      });
    }

    //turn genderList in number[]
    if (genres !== undefined) {
      findBook.genreList = genres.split(',').map((v) => {
        return parseInt(v);
      });
    }

    //turn authorList in number[]
    if (authors !== undefined) {
      findBook.authorList = authors.split(',').map((v) => {
        return parseInt(v);
      });
    }

    //turn release year in a number
    if (release_year !== undefined)
      findBook.release_year = parseInt(release_year);

    //turn number_pages in a array with 0 and 1 position
    if (number_pages !== undefined) {
      const npArray: string[] = number_pages.split(',');
      findBook.number_pages = [];
      findBook.number_pages[0] = parseInt(npArray[0]);
      findBook.number_pages[1] = parseInt(npArray[1]);
    }

    // get isbn
    if (isbn !== undefined) findBook.isbn = isbn;

    // get isbn
    if (edition !== undefined) findBook.edition = parseInt(edition);

    //get title
    if (title !== undefined) findBook.title = title;

    findBook.limit = limit == undefined ? 5 : parseInt(limit);
    findBook.page =
      page == undefined ? 0 : findBook.limit * (parseInt(page) - 1);

    return {
      data: await this.bookService.findAll(findBook),
      count: await this.bookService.count(),
    };
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
