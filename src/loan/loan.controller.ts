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
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReturnBookDto } from './dto/return-book.dto';
import { BookService } from 'src/book/book.service';
import { PersonService } from 'src/person/person.service';
import { FindLoanDto } from './dto/find-loan.dto';
import { FindLoanHistoryDto } from './dto/find-loan-history.dto';
import * as moment from 'moment';
import { Book } from 'src/book/entities/book.entity';
import { Person } from 'src/person/entities/person.entity';

@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly bookService: BookService,
    private readonly personService: PersonService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {

    let book: Book = await this.bookService.findOne(createLoanDto.bookId);
    if (null == book) {
      throw new HttpException(
        'Livro selecionado não encontrado. Código do livro: ' + createLoanDto.bookId + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (null != createLoanDto.personId) {
      let person: Person = await this.personService.findOne(createLoanDto.personId);
      if (null == person) {
        throw new HttpException(
          'Pessoa selecionada não encontrada. Código da pessoa: ' + createLoanDto.personId + '.',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const isBookLoaned = await this.loanService.findLoanedBook(
      createLoanDto.bookId,
    );
    if (isBookLoaned[1] != 0) {
      throw new HttpException(
        'Este livro já está emprestado',
        HttpStatus.BAD_REQUEST,
      );
    }


    // valida datas de previsão de devolução e de empréstimo
    let must_return_date = moment(createLoanDto.must_return_date);
    let loan_date = moment(createLoanDto.loan_date);

    if (null != createLoanDto.must_return_date) {
      let is_must_return_date_valid = must_return_date.isValid();
      if (!is_must_return_date_valid) {
        throw new HttpException(
          'Informe uma data de previsão de devolução válida',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (null != createLoanDto.loan_date) {
      let is_loan_date_valid = loan_date.isValid();
      if (!is_loan_date_valid) {
        throw new HttpException(
          'Informe uma data de empréstimo válida',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    if (must_return_date.isBefore(loan_date)) {
      throw new HttpException(
        'Data de previsão de devolução está anterior a data do empréstimo',
        HttpStatus.BAD_REQUEST
      );
    }

    // valida data de retorno
    if (null != createLoanDto.return_date) {
      let return_date = moment(createLoanDto.return_date);
      let is_return_date_valid = return_date.isValid();
      if (!is_return_date_valid) {
        throw new HttpException(
          'Informe uma data de devolução válida',
          HttpStatus.BAD_REQUEST
        );
      }

      if (return_date.isBefore(loan_date)) {
        throw new HttpException(
          'Data de devolução está anterior a data do empréstimo',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const newLoan = await this.loanService.create(createLoanDto);

    return {
      id: newLoan.id,
      description: newLoan.description,
      loan_date: newLoan.loan_date,
      must_return_date: newLoan.must_return_date,
      return_date: newLoan.return_date,
      book: newLoan.book,
      person: newLoan.person
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('book') book: string,
    @Query('person') person: string,
    @Query('description') description: string,
    @Query('returned') returned: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
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

    if (start_date !== undefined) findLoan.start_date = start_date;

    if (end_date !== undefined) findLoan.end_date = end_date;

    if (book !== undefined) findLoan.book = parseInt(book);

    if (person !== undefined) findLoan.person = parseInt(person);

    if (description !== undefined) findLoan.description = description;

    if (returned !== undefined)
      if (returned == 'true')
        findLoan.returned = true;
      else
        findLoan.returned = false;

    findLoan.limit = limit == undefined ? 5 : parseInt(limit);
    findLoan.page =
      page == undefined ? 0 : findLoan.limit * (parseInt(page) - 1);

    return {
      data: await this.loanService.findAll(findLoan),
      count: await this.loanService.count(findLoan),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const loan = await this.loanService.findOne(+id);
    if (loan === null) {
      throw new HttpException(
        'Não existe um empréstimo com esse código',
        HttpStatus.NOT_FOUND,
      );
    }

    return loan;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    let bookUpdated = await this.loanService.update(+id, updateLoanDto);

    if (1 == bookUpdated.affected)
      return this.loanService.findOne(+id);
    else
      throw new HttpException(
        'Ocorreu um erro para atualizar o empréstimo, entre em contato com o suporte',
        HttpStatus.BAD_REQUEST
      );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('/return/:id')
  async return(@Param('id') id: string, @Body() returnBookDto: ReturnBookDto) {
    let bookUpdated = await this.loanService.returnBook(+id, returnBookDto);

    if (1 == bookUpdated.affected)
      return this.loanService.findOne(+id);
    else
      throw new HttpException(
        'Ocorreu um erro para atualizar o empréstimo, entre em contato com o suporte',
        HttpStatus.BAD_REQUEST
      );
  }

  // get the current loan for the given book id
  @UseGuards(AuthGuard)
  @Get('/book/:bookId')
  async book(@Param('bookId') bookId: string) {
    const book = await this.bookService.findOne(+bookId);
    if (book === null) {
      throw new HttpException(
        'Não existe um livro com esse código',
        HttpStatus.NOT_FOUND,
      );
    }
    const loan = await this.loanService.findCurrentLoanFromBook(+bookId);
    if (loan === null)
      throw new HttpException(
        'Não foi encontrado nenhum empréstimo para o livro',
        HttpStatus.BAD_REQUEST,
      );
    else return loan;
  }

  // get the loan history for the given person id
  @UseGuards(AuthGuard)
  @Get('/person/:personId/history')
  async personHistory(
    @Param('personId') personId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const person = await this.personService.findOne(+personId);
    if (person === null) {
      throw new HttpException(
        'Não existe uma pessoa com esse código',
        HttpStatus.NOT_FOUND,
      );
    }

    const findLoanHistory: FindLoanHistoryDto = {
      page: null,
      limit: null,
    };

    findLoanHistory.limit = limit == undefined ? 5 : parseInt(limit);
    findLoanHistory.page =
      page == undefined ? 0 : findLoanHistory.limit * (parseInt(page) - 1);

    return {
      data: await this.loanService.findLoanHistoryFromPerson(
        +personId,
        findLoanHistory,
      ),
      count: await this.loanService.findAndCountLoanHistoryFromPerson(
        +personId,
        findLoanHistory,
      ),
    };
  }
}
