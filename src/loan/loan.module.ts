import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { BookService } from '../book/book.service';
import { Book } from '../book/entities/book.entity';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, Person])],
  controllers: [LoanController],
  providers: [LoanService, BookService, PersonService],
})
export class LoanModule {}
