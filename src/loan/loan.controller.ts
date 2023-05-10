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
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReturnBookDto } from './dto/return-book.dto';
import { BookService } from 'src/book/book.service';
import { PersonService } from 'src/person/person.service';

@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly bookService: BookService,
    private readonly personService: PersonService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    const isBookLoaned = await this.loanService.findLoanedBook(
      createLoanDto.book.id,
    );
    if (isBookLoaned[1] !== 0) {
      throw new HttpException(
        'Este livro já está emprestado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.loanService.create(createLoanDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.loanService.findAll();
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
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loanService.update(+id, updateLoanDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('/return/:id')
  return(@Param('id') id: string, @Body() returnBookDto: ReturnBookDto) {
    return this.loanService.returnBook(+id, returnBookDto);
  }

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
    return this.loanService.findCurrentLoanFromBook(+bookId);
  }

  @UseGuards(AuthGuard)
  @Get('/book/:bookId/history')
  async bookHistory(@Param('bookId') bookId: string) {
    const book = await this.bookService.findOne(+bookId);
    if (book === null) {
      throw new HttpException(
        'Não existe um livro com esse código',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.loanService.findLoanHistoryFromBook(+bookId);
  }

  @UseGuards(AuthGuard)
  @Get('/person/:personId/history')
  async personHistory(@Param('personId') personId: string) {
    const person = await this.personService.findOne(+personId);
    if (person === null) {
      throw new HttpException(
        'Não existe uma pessoa com esse código',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.loanService.findLoanHistoryFromPerson(+personId);
  }
}
