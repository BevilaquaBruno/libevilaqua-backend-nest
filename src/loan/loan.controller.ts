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
import { find } from 'rxjs';

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
    
    const isBookLoaned = await this.loanService.findLoanedBook(
      createLoanDto.bookId,
    );
    
    if (isBookLoaned[1] != 0) {
      throw new HttpException(
        'Este livro já está emprestado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.loanService.create(createLoanDto);
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
      if (returned == '1')
        findLoan.returned = true;
      else
        findLoan.returned = false;

    findLoan.limit = limit == undefined ? 5 : parseInt(limit);
    findLoan.page =
      page == undefined ? 0 : findLoan.limit * (parseInt(page) - 1);

    return {
      data: await this.loanService.findAll(findLoan),
      count: await this.loanService.count(),
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

    if(1 == bookUpdated.affected)
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

    if(1 == bookUpdated.affected)
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
