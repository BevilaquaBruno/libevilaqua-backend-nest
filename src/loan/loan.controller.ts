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

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

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
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(+id);
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
  book(@Param('bookId') bookId: string) {
    return this.loanService.findCurrentLoanFromBook(+bookId);
  }

  @UseGuards(AuthGuard)
  @Get('/book/history/:bookId')
  bookHistory(@Param('bookId') bookId: string) {
    return this.loanService.findLoanHistoryFromBook(+bookId);
  }
}
