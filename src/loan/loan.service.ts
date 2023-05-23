import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Loan } from './entities/loan.entity';
import { ReturnBookDto } from './dto/return-book.dto';
import { FindLoanDto } from './dto/find-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private loanServiceRepository: Repository<Loan>,
  ) {}
  create(createLoanDto: CreateLoanDto) {
    return this.loanServiceRepository.save(createLoanDto);
  }

  findAll(findLoan: FindLoanDto) {
    const query = this.loanServiceRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.person', 'person')
      .leftJoinAndSelect('loan.book', 'book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .where('1 = 1');

    //find loan with the between date
    if (findLoan.start_date !== null && findLoan.end_date !== null)
      query.andWhere({
        loan_date: Between(findLoan.start_date, findLoan.end_date),
      });
    //find loan with just the start date
    else if (findLoan.start_date !== null)
      query.andWhere({
        loan_date: MoreThanOrEqual(findLoan.start_date),
      });
    //find loan with just the end date
    else if (findLoan.end_date !== null)
      query.andWhere({
        loan_date: LessThanOrEqual(findLoan.end_date),
      });

    //find loan with the book
    if (findLoan.book !== null) {
      query.andWhere({ book: findLoan.book });
    }

    // find loan with the person
    if (findLoan.person !== null) {
      query.andWhere({ person: findLoan.person });
    }

    // find loan with the description
    if (findLoan.description != null)
      query.andWhere({ description: Like(`%${findLoan.description}%`) });

    return query.getMany();
  }

  findOne(id: number) {
    return this.loanServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    return await this.loanServiceRepository.update(id, updateLoanDto);
  }

  async remove(id: number) {
    return await this.loanServiceRepository.delete({ id });
  }

  async returnBook(id: number, returnBookDto: ReturnBookDto) {
    return await this.loanServiceRepository.update(id, returnBookDto);
  }

  findLoanedBook(bookId: number) {
    return this.loanServiceRepository.findAndCountBy({
      book: { id: bookId },
      return_date: IsNull(),
    });
  }

  findCurrentLoanFromBook(bookId: number) {
    return this.loanServiceRepository.findOneBy({
      book: { id: bookId },
      return_date: IsNull(),
    });
  }

  findLoanHistoryFromBook(bookId: number) {
    return this.loanServiceRepository.findBy({
      book: { id: bookId },
    });
  }

  findLoanHistoryFromPerson(personId: number) {
    return this.loanServiceRepository.findBy({
      person: { id: personId },
    });
  }
}
