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
import * as moment from 'moment';
import { Author } from './entities/author.entity';

@Controller('author')
export class AuthorController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    if (null != createAuthorDto.birth_date) {
      const isBirthDateValid = moment(createAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'Informe uma data de nascimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (null != createAuthorDto.death_date) {
      const isDeathDateValid = moment(createAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'Informe uma data de falecimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const birth_moment = moment(createAuthorDto.birth_date);
    const death_moment = moment(createAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'Data de nascimento está maior que a data de falecimento.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newAuthor = await this.authorService.create(createAuthorDto);
    return {
      id: newAuthor.id,
      name: newAuthor.name,
      birth_date: newAuthor.birth_date,
      death_date: newAuthor.death_date,
      bio: newAuthor.bio,
    };
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
  async findOne(@Param('id') id: string) {
    const author: Author = await this.authorService.findOne(+id);

    if (null == author)
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return author;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const author: Author = await this.authorService.findOne(+id);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (null != updateAuthorDto.birth_date) {
      const isBirthDateValid = moment(updateAuthorDto.birth_date).isValid();
      if (!isBirthDateValid) {
        throw new HttpException(
          'Informe uma data de nascimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (null != updateAuthorDto.death_date) {
      const isDeathDateValid = moment(updateAuthorDto.death_date).isValid();
      if (!isDeathDateValid) {
        throw new HttpException(
          'Informe uma data de falecimento válida.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const birth_moment = moment(updateAuthorDto.birth_date);
    const death_moment = moment(updateAuthorDto.death_date);
    if (birth_moment.isAfter(death_moment)) {
      throw new HttpException(
        'Data de nascimento está maior que a data de falecimento.',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const author: Author = await this.authorService.findOne(+id);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

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

  @UseGuards(AuthGuard)
  @Get('/:authorId/books')
  async books(
    @Param('authorId') authorId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const author: Author = await this.authorService.findOne(+authorId);
    if (null == author) {
      throw new HttpException(
        'Autor não encontrado. Código do autor: ' + authorId + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    const findAuthorBooks: FindAuthorBooksDto = {
      page: null,
      limit: null,
      authorId: null,
    };

    findAuthorBooks.authorId = +authorId;
    findAuthorBooks.limit = limit == undefined ? 5 : parseInt(limit);
    findAuthorBooks.page =
      page == undefined ? 0 : findAuthorBooks.limit * (parseInt(page) - 1);

    return this.bookService.findBooksFromAuthor(findAuthorBooks);
  }
}
