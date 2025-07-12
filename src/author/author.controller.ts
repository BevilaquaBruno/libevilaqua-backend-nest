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
import { AuthGuard } from '../../src/auth/auth.guard';
import { BookService } from '../../src/book/book.service';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAuthorDto } from './dto/find-author.dto';
import { FindAuthorBooksDto } from './dto/find-author-books.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import * as moment from 'moment';
import { Author } from './entities/author.entity';

@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

  // Cria um autor
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    // Valida a data de nascimento do autor, se existir
    if (null != createAuthorDto.birth_date) {
      const isBirthDateValid = moment(createAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'Informe uma data de nascimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida a data de morte do autor, se existir
    if (null != createAuthorDto.death_date) {
      const isDeathDateValid = moment(createAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'Informe uma data de falecimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Compara a data de nascimento e a data de morte para que a de morte não seja menor que a de nascimento
    const birth_moment = moment(createAuthorDto.birth_date);
    const death_moment = moment(createAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'Data de nascimento está maior que a data de falecimento.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cria o autor e retorna ele cadastrado
    const newAuthor = await this.authorService.create(createAuthorDto);
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
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
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
      data: await this.authorService.findAll(findAuthor),
      count: await this.authorService.count(),
    };
  }

  // Retorna um autor
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Valida se o id retornado existe, retorna erro ou retorna o autor
    const author: Author = await this.authorService.findOne(+id);
    if (null == author)
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    return author;
  }

  // Atualiza o autor
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    // valida se o id do autor existe
    const author: Author = await this.authorService.findOne(+id);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Valida a data de nascimento do autor, se existir
    if (null != updateAuthorDto.birth_date) {
      const isBirthDateValid = moment(updateAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'Informe uma data de nascimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida a data de morte do autor, se existir
    if (null != updateAuthorDto.death_date) {
      const isDeathDateValid = moment(updateAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'Informe uma data de falecimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Compara a data de nascimento e a data de morte para que a de morte não seja menor que a de nascimento
    const birth_moment = moment(updateAuthorDto.birth_date);
    const death_moment = moment(updateAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'Data de nascimento está maior que a data de falecimento.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atualiza o autor, retorna o autor ou retorna o erro
    const updatedAuthor = await this.authorService.update(+id, updateAuthorDto);
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
        'Ocorreu algum erro com a atualização do autor.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta o autor
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Consulta se o autor existe
    const author: Author = await this.authorService.findOne(+id);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Pesquisa um livro do autor, se ele tiver 1 livro, não deixa excluir
    const books = await this.bookService.findBooksFromAuthor({
      page: 1,
      limit: 1,
      authorId: +id,
    });
    if (books.length > 0) {
      throw new HttpException(
        'Existem livros vinculados a esse autor, não é possível excluir.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o autor e retorna o sucesso ou erro
    const deletedAuthor = await this.authorService.remove(+id);
    if (deletedAuthor.affected == 1) {
      throw new HttpException('Autor deletado com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o Autor.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retorna todos os livros do autor
  @UseGuards(AuthGuard)
  @Get('/:authorId/books')
  async books(
    @Param('authorId') authorId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    // Consulta se o autor existe
    const author: Author = await this.authorService.findOne(+authorId);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + authorId + '.',
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

    return this.bookService.findBooksFromAuthor(findAuthorBooks);
  }
}
