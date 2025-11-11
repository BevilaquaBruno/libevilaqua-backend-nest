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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../../src/auth/auth.guard';
import { BookService } from '../../src/book/book.service';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAuthorDto } from './dto/find-author.dto';
import { FindAuthorBooksDto } from './dto/find-author-books.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import * as moment from 'moment';
import { Author } from './entities/author.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) { }

  // Cria um autor
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Valida a data de nascimento do autor, se existir
    if (null != createAuthorDto.birth_date) {
      const isBirthDateValid = moment(createAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'author.birth_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida a data de morte do autor, se existir
    if (null != createAuthorDto.death_date) {
      const isDeathDateValid = moment(createAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'author.death_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Compara a data de nascimento e a data de morte para que a de morte não seja menor que a de nascimento
    const birth_moment = moment(createAuthorDto.birth_date);
    const death_moment = moment(createAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'author.birth_date.is_after_death_date',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cria o autor e retorna ele cadastrado
    const newAuthor = await this.authorService.create(createAuthorDto, reqUser.libraryId);
    return {
      id: newAuthor.id,
      name: newAuthor.name,
      birth_date: newAuthor.birth_date,
      death_date: newAuthor.death_date,
      bio: newAuthor.bio,
    };
  }

  // Retorna todos autores
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number.', schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, example: '10', description: 'Limit of registers in the page.', schema: { default: 5 } })
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria o padrão de paginação e limite
    const findAuthor: FindAuthorDto = {
      page: null,
      limit: null,
    };

    // Define a paginação e o limite
    findAuthor.limit = limit == undefined ? 5 : parseInt(limit);
    findAuthor.page =
      page == undefined ? 0 : findAuthor.limit * (parseInt(page) - 1);

    // Retorna o autor com a paginação e limite
    return {
      data: await this.authorService.findAll(findAuthor, reqUser.libraryId),
      count: await this.authorService.count(reqUser.libraryId),
    };
  }

  // Retorna um autor
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Author id.' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Valida se o id retornado existe, retorna erro ou retorna o autor
    const author: Author = await this.authorService.findOne(+id, reqUser.libraryId);
    if (null == author)
      throw new HttpException(
        'author.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    return author;
  }

  // Atualiza o autor
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Author id.' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // valida se o id do autor existe
    const author: Author = await this.authorService.findOne(+id, reqUser.libraryId);
    if (null == author) {
      throw new HttpException(
        'author.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Valida a data de nascimento do autor, se existir
    if (null != updateAuthorDto.birth_date) {
      const isBirthDateValid = moment(updateAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'author.birth_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida a data de morte do autor, se existir
    if (null != updateAuthorDto.death_date) {
      const isDeathDateValid = moment(updateAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'author.death_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Compara a data de nascimento e a data de morte para que a de morte não seja menor que a de nascimento
    const birth_moment = moment(updateAuthorDto.birth_date);
    const death_moment = moment(updateAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'author.birth_date.is_after_death_date',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atualiza o autor, retorna o autor ou retorna o erro
    const updatedAuthor = await this.authorService.update(+id, updateAuthorDto, reqUser.libraryId);
    if (updatedAuthor.affected == 1) {
      return {
        id: +id,
        name: updateAuthorDto.name,
        birth_date: updateAuthorDto.birth_date,
        death_date: updateAuthorDto.death_date,
        bio: updateAuthorDto.bio,
      };
    } else {
      throw new HttpException(
        'author.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta o autor
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Author id.' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta se o autor existe
    const author: Author = await this.authorService.findOne(+id, reqUser.libraryId);
    if (null == author) {
      throw new HttpException(
        'author.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Pesquisa um livro do autor, se ele tiver 1 livro, não deixa excluir
    const books = await this.bookService.findBooksFromAuthor({
      page: 1,
      limit: 1,
      authorId: +id
    }, reqUser.libraryId);
    if (books.length > 0) {
      throw new HttpException(
        'author.general.has_books',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o autor e retorna o sucesso ou erro
    const deletedAuthor = await this.authorService.remove(+id, reqUser.libraryId);
    if (deletedAuthor.affected == 1) {
      return {
        statusCode: 200,
        message: 'author.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'author.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retorna todos os livros do autor

  @UseGuards(AuthGuard)
  @Get('/:authorId/books')
  @ApiParam({ name: 'authorId', required: false, example: '1', description: 'Author id.', schema: { default: 1 } })
  @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number.', schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, example: '10', description: 'Limit of registers in the page.', schema: { default: 5 } })
  async books(@Req() req: Request,
    @Param('authorId') authorId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta se o autor existe
    const author: Author = await this.authorService.findOne(+authorId, reqUser.libraryId);
    if (null == author) {
      throw new HttpException(
        'author.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Cria a paginação para a consulta
    const findAuthorBooks: FindAuthorBooksDto = {
      page: null,
      limit: null,
      authorId: null,
    };

    // Define a paginação para a consulta
    findAuthorBooks.authorId = +authorId;
    findAuthorBooks.limit = limit == undefined ? 5 : parseInt(limit);
    findAuthorBooks.page =
      page == undefined ? 0 : findAuthorBooks.limit * (parseInt(page) - 1);

    const allBooks = await this.bookService.findAndCountBooksFromAuthor(findAuthorBooks, reqUser.libraryId);
    return {
      data: allBooks[0],
      count: allBooks[1]
    }
  }
}
