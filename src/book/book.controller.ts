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
import { GenreService } from '../genre/genre.service';
import { PublisherService } from '../publisher/publisher.service';
import { TypeService } from '../type/type.service';
import { AuthorService } from '../author/author.service';
import { TagService } from '../tag/tag.service';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly genreService: GenreService,
    private readonly publisherService: PublisherService,
    private readonly typeService: TypeService,
    private readonly authorService: AuthorService,
    private readonly tagService: TagService
  ) { }

  // Cria um livro
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createBookDto: CreateBookDto) {
    const reqUser: PayloadAuthDto = req['user'];

    if (createBookDto.genre_id) {
      const genreExists = await this.genreService.findOne(createBookDto.genre_id, reqUser.libraryId);

      if (!genreExists) {
        throw new HttpException(
          'Gênero não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createBookDto.publisher_id) {
      const publisherExists = await this.publisherService.findOne(createBookDto.publisher_id, reqUser.libraryId);

      if (!publisherExists) {
        throw new HttpException(
          'Editora não encontrada.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createBookDto.type_id) {
      const typeExists = await this.typeService.findOne(createBookDto.type_id, reqUser.libraryId);

      if (!typeExists) {
        throw new HttpException(
          'Tipo não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createBookDto.authors_id.length > 0) {
      const authorsExists = await this.authorService.getAuthorList(createBookDto.authors_id, reqUser.libraryId);

      if (authorsExists.length != createBookDto.authors_id.length) {
        throw new HttpException(
          'Um dos autores não foi encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (createBookDto.tags_id.length > 0) {
      const tagsExists = await this.tagService.getTagList(createBookDto.tags_id, reqUser.libraryId);

      if (tagsExists.length != createBookDto.tags_id.length) {
        throw new HttpException(
          'Uma das tags não foi encontrada.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

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
    @Query('status') status: string,
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
      status: null,
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

    if (status !== undefined) {
      if ('true' == status)
        findBook.status = true;
      else
        findBook.status = false;
    }

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

    if (updateBookDto.genre_id) {
      const genreExists = await this.genreService.findOne(updateBookDto.genre_id, reqUser.libraryId);

      if (!genreExists) {
        throw new HttpException(
          'Gênero não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateBookDto.publisher_id) {
      const publisherExists = await this.publisherService.findOne(updateBookDto.publisher_id, reqUser.libraryId);

      if (!publisherExists) {
        throw new HttpException(
          'Editora não encontrada.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateBookDto.type_id) {
      const typeExists = await this.typeService.findOne(updateBookDto.type_id, reqUser.libraryId);

      if (!typeExists) {
        throw new HttpException(
          'Tipo não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateBookDto.authors_id.length > 0) {
      const authorsExists = await this.authorService.getAuthorList(updateBookDto.authors_id, reqUser.libraryId);

      if (authorsExists.length != updateBookDto.authors_id.length) {
        throw new HttpException(
          'Um dos autores não foi encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateBookDto.tags_id.length > 0) {
      const tagsExists = await this.tagService.getTagList(updateBookDto.tags_id, reqUser.libraryId);

      if (tagsExists.length != updateBookDto.tags_id.length) {
        throw new HttpException(
          'Uma das tags não foi encontrada.',
          HttpStatus.BAD_REQUEST,
        );
      }
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
