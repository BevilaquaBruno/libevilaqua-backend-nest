import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { BookService } from 'src/book/book.service';
import { Book } from 'src/book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book])],
  controllers: [LoanController],
  providers: [LoanService, BookService],
})
export class LoanModule {}
