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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../../src/auth/auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  // Cria um livro
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createBookDto: CreateBookDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Não tem outras validações além das contidas no DTO do livro, apenas cria ele
    const newBook = await this.bookService.create(createBookDto, reqUser.libraryId);

    return {
      id: newBook.id,
      ...createBookDto,
    };
  }

  // Retorna todos os livros
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Req() req: Request,
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
    const reqUser: PayloadAuthDto = req['user'];
    // Cria a lista de filtros e paginação do livro
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

    // Transforma os itens passados na URL
    // Transforma a typeList em number[]
    if (types !== undefined) {
      findBook.typeList = types.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a publisherList em number[]
    if (publishers !== undefined) {
      findBook.publisherList = publishers.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a taglist em number[]
    if (tags !== undefined) {
      findBook.tagList = tags.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a genderList em number[]
    if (genres !== undefined) {
      findBook.genreList = genres.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a authorList em number[]
    if (authors !== undefined) {
      findBook.authorList = authors.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma o release_year em number
    if (release_year !== undefined)
      findBook.release_year = parseInt(release_year);

    // Transforma o number_pages em array com as posições 0 e 1
    if (number_pages !== undefined) {
      const npArray: string[] = number_pages.split(',');
      findBook.number_pages = [];
      findBook.number_pages[0] = parseInt(npArray[0]);
      findBook.number_pages[1] = parseInt(npArray[1]);
    }

    // Pega o isbn
    if (isbn !== undefined) findBook.isbn = isbn;

    // Pega a edição
    if (edition !== undefined) findBook.edition = parseInt(edition);

    // Pega o título
    if (title !== undefined) findBook.title = title;

    // Define a paginação
    findBook.limit = limit == undefined ? 5 : parseInt(limit);
    findBook.page =
      page == undefined ? 0 : findBook.limit * (parseInt(page) - 1);

    // Consulta no banco com os filtros passados, tanto no count quando nos dados
    return {
      data: await this.bookService.findAll(findBook, reqUser.libraryId),
      count: await this.bookService.count(findBook, reqUser.libraryId),
    };
  }

  // Retorna um livro
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta o livro, retorna se existe ou retorna erro
    const book: Book = await this.bookService.findOne(+id, reqUser.libraryId);

    if (null == book) {
      throw new HttpException(
        'Livro não encontrado. Código do livro: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }

  // Atualiza o livro
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta se o livro existe, se existe atualiza
    const book: Book = await this.bookService.findOne(+id, reqUser.libraryId);

    if (null == book) {
      throw new HttpException(
        'Livro não encontrado. Código do livro: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedBook = await this.bookService.update(+id, updateBookDto);

    return {
      id: updatedBook.id,
      ...updateBookDto,
    };
  }

  // Deleta um livro
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta se o livro existe
    const book: Book = await this.bookService.findOne(+id, reqUser.libraryId);

    if (null == book) {
      throw new HttpException(
        'Livro não encontrado. Código do livro: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o livro, retorna com sucesso ou não
    const deletedBook = await this.bookService.remove(+id, reqUser.libraryId);
    if (deletedBook.affected == 1) {
      return {
        statusCode: 200,
        message: 'Livro deletado com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o livro.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
