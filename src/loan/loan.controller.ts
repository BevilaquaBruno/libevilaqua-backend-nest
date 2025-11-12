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
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { ReturnBookDto } from './dto/return-book.dto';
import { BookService } from '../../src/book/book.service';
import { PersonService } from '../../src/person/person.service';
import { FindLoanDto } from './dto/find-loan.dto';
import { FindLoanHistoryDto } from './dto/find-loan-history.dto';
import * as moment from 'moment';
import { Book } from '../../src/book/entities/book.entity';
import { Person } from '../../src/person/entities/person.entity';
import { Loan } from './entities/loan.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly bookService: BookService,
    private readonly personService: PersonService,
  ) { }

  // Cria um empréstimo
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createLoanDto: CreateLoanDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta o livro e retorna erro se não encontrado
    const book: Book = await this.bookService.findOne(createLoanDto.bookId, reqUser.libraryId);
    if (null == book) {
      throw new HttpException(
        'book.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Consulta a pessoa e retorna erro se não encontrada
    const person: Person = await this.personService.findOne(
      createLoanDto.personId,
      reqUser.libraryId
    );
    if (null == person) {
      throw new HttpException(
        'person.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Consulta se o livro já está emprestado
    const isBookLoaned = await this.loanService.findLoanedBook(
      createLoanDto.bookId,
      null,
      reqUser.libraryId
    );
    if (isBookLoaned[1] != 0) {
      throw new HttpException(
        'loan.general.book_is_loaned',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida datas
    const must_return_date = moment(createLoanDto.must_return_date);
    const loan_date = moment(createLoanDto.loan_date);
    // Valida se a data de previsão é válida
    if (null != createLoanDto.must_return_date) {
      const is_must_return_date_valid = must_return_date.isValid();
      if (!is_must_return_date_valid) {
        throw new HttpException(
          'loan.must_return_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida se a data de empréstimo é válida
    if (null != createLoanDto.loan_date) {
      const is_loan_date_valid = loan_date.isValid();
      if (!is_loan_date_valid) {
        throw new HttpException(
          'loan.loan_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida se a data de previsão de retorno é anterior a data do empréstimo, se for retorna erro
    if (must_return_date.isBefore(loan_date)) {
      throw new HttpException(
        'loan.must_return_date.is_before_loan_date',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida a data de retorno
    if (null != createLoanDto.return_date) {
      const return_date = moment(createLoanDto.return_date);
      const is_return_date_valid = return_date.isValid();
      if (!is_return_date_valid) {
        throw new HttpException(
          'loan.return_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida se a data de retorno é anterior a data do empréstimo, se for retorna erro
      if (return_date.isBefore(loan_date)) {
        throw new HttpException(
          'loan.return_date.is_before_loan_date',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Cria o empréstimo e retorna
    const newLoan = await this.loanService.create(createLoanDto, reqUser.libraryId);

    return {
      id: newLoan.id,
      description: newLoan.description,
      loan_date: newLoan.loan_date,
      must_return_date: newLoan.must_return_date,
      return_date: newLoan.return_date,
      book: newLoan.book,
      person: newLoan.person,
    };
  }

  // Retorna todos os empréstimos
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'start_date', required: false, example: '2024-01-01', description: 'Start date to filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'end_date', required: false, example: '2024-31-12', description: 'End date to filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'book', required: false, example: '1', description: 'Book filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'person', required: false, example: '1', description: 'Person filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'description', required: false, example: '1', description: 'Description filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'returned', required: false, example: 'true', examples: { returned: {summary: 'Returned loans', value: 'true'}, notReturned: {summary: 'Pending loans', value: 'false'} }, description: 'Return or not filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number.', schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, example: '10', description: 'Limit of registers in the page.', schema: { default: 5 } })
  async findAll(
    @Req() req: Request,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('book') book: string,
    @Query('person') person: string,
    @Query('description') description: string,
    @Query('returned') returned: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria o filtro do empréstimop
    const findLoan: FindLoanDto = {
      start_date: null,
      end_date: null,
      book: null,
      person: null,
      description: null,
      returned: null,
      limit: null,
      page: null,
    };

    // Define os filtros com base no que veio na URL
    if (undefined != start_date && '' != start_date) findLoan.start_date = start_date;

    if (undefined != end_date && '' != end_date) findLoan.end_date = end_date;

    if (undefined != book && '' != book) findLoan.book = parseInt(book);

    if (undefined != person && '' != person) findLoan.person = parseInt(person);

    if (undefined != description && '' != description) findLoan.description = description;

    /**
     * Valida o retorno do livr
     * returned = true - Apenas livros retornados
     * returned = true - Apenas livros não retornados
     * returned = undefined - Todos os livros
     */
    if (undefined != returned && '' != returned)
      if (returned == 'true')
        findLoan.returned = true;
      else
        findLoan.returned = false;

    // Define a paginação
    findLoan.limit = limit == undefined ? 5 : parseInt(limit);
    findLoan.page =
      page == undefined ? 0 : findLoan.limit * (parseInt(page) - 1);

    return {
      data: await this.loanService.findAll(findLoan, reqUser.libraryId),
      count: await this.loanService.count(findLoan, reqUser.libraryId),
    };
  }

  // Retorna um empréstimo
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Loan id.' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Verifica se existe o empréstimo e retorna
    const loan = await this.loanService.findOne(+id, reqUser.libraryId);
    if (loan === null) {
      throw new HttpException(
        'loan.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    return loan;
  }

  // Atualiza o empréstimo
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Loan id.' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Consulta se o empréstimo existe
    const currentLoan: Loan = await this.loanService.findOne(+id, reqUser.libraryId);
    if (null == currentLoan) {
      throw new HttpException(
        'loan.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Consulta o livro e retorna erro se não encontrado
    const book: Book = await this.bookService.findOne(updateLoanDto.bookId, reqUser.libraryId);
    if (null == book) {
      throw new HttpException(
        'book.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Consulta a pessoa e retorna erro se não encontrada
    if (null != updateLoanDto.personId) {
      const person: Person = await this.personService.findOne(
        updateLoanDto.personId,
        reqUser.libraryId
      );
      if (null == person) {
        throw new HttpException(
          'person.general.not_found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    // Consulta se o livro já está emprestado - excluí o id do empréstimo atual na consulta
    const isBookLoaned = await this.loanService.findLoanedBook(
      updateLoanDto.bookId,
      +id,
      reqUser.libraryId
    );
    if (isBookLoaned[1] != 0) {
      throw new HttpException(
        'loan.general.book_is_loaned',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida datas
    const must_return_date = moment(updateLoanDto.must_return_date);
    const loan_date = moment(updateLoanDto.loan_date);
    // Valida se a data de previsão é válida
    if (null != updateLoanDto.must_return_date) {
      const is_must_return_date_valid = must_return_date.isValid();
      if (!is_must_return_date_valid) {
        throw new HttpException(
          'loan.must_return_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida se a data de empréstimo é válida
    if (null != updateLoanDto.loan_date) {
      const is_loan_date_valid = loan_date.isValid();
      if (!is_loan_date_valid) {
        throw new HttpException(
          'loan.loan_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Valida se a data de previsão de retorno é anterior a data do empréstimo, se for retorna erro
    if (must_return_date.isBefore(loan_date)) {
      throw new HttpException(
        'loan.must_return_date.is_before_loan_date',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida a data de retorno
    if (null != updateLoanDto.return_date) {
      const return_date = moment(updateLoanDto.return_date);
      const is_return_date_valid = return_date.isValid();
      if (!is_return_date_valid) {
        throw new HttpException(
          'loan.return_date.invalid',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida se a data de retorno é anterior a data do empréstimo, se for retorna erro
      if (return_date.isBefore(loan_date)) {
        throw new HttpException(
          'loan.return_date.is_before_loan_date',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Atualiza o empréstimo e retorna erro ou os dados do empréstimo
    const updatedLoan = await this.loanService.update(+id, updateLoanDto, reqUser.libraryId);
    if (updatedLoan.affected == 1) {
      return {
        id: +id,
        description: updateLoanDto.description,
        loan_date: updateLoanDto.loan_date,
        must_return_date: updateLoanDto.must_return_date,
        return_date: updateLoanDto.return_date,
        book: await this.bookService.findOne(updateLoanDto.bookId, reqUser.libraryId),
        person: await this.personService.findOne(updateLoanDto.personId, reqUser.libraryId),
      };
    } else {
      throw new HttpException(
        'loan.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta um empréstimo
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Loan id.' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se o empréstimo existe
    const loan: Loan = await this.loanService.findOne(+id, reqUser.libraryId);
    if (null == loan) {
      throw new HttpException(
        'loan.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta ou não o empréstimo
    const deletedLoan = await this.loanService.remove(+id, reqUser.libraryId);
    if (deletedLoan.affected == 1) {
      return {
        statusCode: 200,
        message: 'loan.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'loan.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retorna o livro (atualiza o returnd_date do empréstimo)
  @UseGuards(AuthGuard)
  @Patch('/return/:id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Loan id.' })
  async return(@Req() req: Request, @Param('id') id: string, @Body() returnBookDto: ReturnBookDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se o empréstimo existe
    const loan: Loan = await this.loanService.findOne(+id, reqUser.libraryId);
    if (null == loan) {
      throw new HttpException(
        'loan.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Verifica se o livro já foi devolvido ou não
    if (null != loan.return_date) {
      const return_date = moment(loan.return_date);
      throw new HttpException(
        'loan.general.book_already_returned',
        HttpStatus.BAD_REQUEST,
      );
    }

    const return_date = moment(returnBookDto.return_date);
    const is_return_date_valid = return_date.isValid();
    if (!is_return_date_valid) {
      throw new HttpException(
        'loan.return_date.invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se a data de retorno é anterior a data do empréstimo, se for retorna erro
    if (return_date.isBefore(loan.loan_date)) {
      throw new HttpException(
        'loan.return_date.is_before_loan_date',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atualiza o empréstimo com a data de retorno - Retorna o empréstimo ou erro
    const bookUpdated = await this.loanService.returnBook(+id, returnBookDto, reqUser.libraryId);
    if (bookUpdated.affected == 1) {
      return {
        id: +id,
        description: loan.description,
        loan_date: loan.loan_date,
        must_return_date: loan.must_return_date,
        return_date: loan.return_date,
        book: loan.book,
        person: loan.person,
      };
    } else {
      throw new HttpException(
        'loan.general.return_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Retorna o empréstimo em aberto do livro
  @UseGuards(AuthGuard)
  @Get('/book/:bookId')
  @ApiParam({ name: 'bookId', required: true, example: '1', description: 'Book id.' })
  async book(@Req() req: Request, @Param('bookId') bookId: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se o livro existe
    const book = await this.bookService.findOne(+bookId, reqUser.libraryId);
    if (book === null) {
      throw new HttpException(
        'book.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Consulta o empréstimo em aberto do livro
    const loan = await this.loanService.findCurrentLoanFromBook(+bookId, reqUser.libraryId);
    if (loan === null)
      throw new HttpException(
        'loan.general.no_pending_loan_found',
        HttpStatus.BAD_REQUEST,
      );
    else return loan;
  }

  // Retorna o histórico de empréstimo da pessoa
  @UseGuards(AuthGuard)
  @Get('/person/:personId/history')
  @ApiParam({ name: 'personId', required: true, example: '1', description: 'Person id.' })
  async personHistory(@Req() req: Request, @Param('personId') personId: string, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a pessoa existe
    const person = await this.personService.findOne(+personId, reqUser.libraryId);
    if (person === null) {
      throw new HttpException(
        'loan.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Cria a paginação
    const findLoanHistory: FindLoanHistoryDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findLoanHistory.limit = limit == undefined ? 5 : parseInt(limit);
    findLoanHistory.page =
      page == undefined ? 0 : findLoanHistory.limit * (parseInt(page) - 1);

    // Retorna a lista de livros da pessoa
    return {
      data: await this.loanService.findLoanHistoryFromPerson(
        +personId,
        findLoanHistory,
        reqUser.libraryId
      ),
      count: await this.loanService.findAndCountLoanHistoryFromPerson(
        +personId,
        findLoanHistory,
        reqUser.libraryId
      ),
    };
  }
}
