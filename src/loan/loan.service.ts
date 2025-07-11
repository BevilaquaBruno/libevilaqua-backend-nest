import { FindLoanHistoryDto } from './dto/find-loan-history.dto';
import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
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
    return this.loanServiceRepository.save({
      description: createLoanDto.description,
      loan_date: createLoanDto.loan_date,
      must_return_date: createLoanDto.must_return_date,
      return_date: createLoanDto.return_date,
      book: { id: createLoanDto.bookId },
      person: { id: createLoanDto.personId },
    });
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

    // find loan with the returned parameter
    if (findLoan.returned != null)
      if (findLoan.returned == false) query.andWhere({ return_date: IsNull() });
      else query.andWhere({ return_date: Not(IsNull()) });

    return query
      .take(findLoan.limit)
      .skip(findLoan.page)
      .orderBy({ 'loan.return_date': 'DESC', 'loan.id': 'DESC' })
      .getMany();
  }

  findOne(id: number) {
    return this.loanServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    return await this.loanServiceRepository.update(id, {
      description: updateLoanDto.description,
      loan_date: updateLoanDto.loan_date,
      must_return_date: updateLoanDto.must_return_date,
      return_date: updateLoanDto.return_date,
      book: { id: updateLoanDto.bookId },
      person: { id: updateLoanDto.personId },
    });
  }

  async remove(id: number) {
    return await this.loanServiceRepository.delete({ id });
  }

  async returnBook(id: number, returnBookDto: ReturnBookDto) {
    return await this.loanServiceRepository.update(id, returnBookDto);
  }

  findLoanedBook(bookId: number, excludeId: number = null) {
    let dynamicWhere: FindOptionsWhere<Loan> = {
      book: { id: bookId },
      return_date: IsNull(),
    };

    if (null != excludeId) {
      dynamicWhere = {
        ...dynamicWhere,
        id: Not(excludeId),
      };
    }
    return this.loanServiceRepository.findAndCountBy(dynamicWhere);
  }

  findCurrentLoanFromBook(bookId: number) {
    return this.loanServiceRepository.findOneBy({
      book: { id: bookId },
      return_date: IsNull(),
    });
  }

  findLoanHistoryFromPerson(
    personId: number,
    findLoanHistoryDto: FindLoanHistoryDto,
  ) {
    return this.loanServiceRepository.find({
      where: {
        person: { id: personId },
      },
      order: { return_date: 'ASC' },
      take: findLoanHistoryDto.limit,
      skip: findLoanHistoryDto.page,
    });
  }

  async count(findLoan: FindLoanDto) {
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

    // find loan with the returned parameter
    if (findLoan.returned != null)
      if (findLoan.returned == false) query.andWhere({ return_date: IsNull() });
      else query.andWhere({ return_date: Not(IsNull()) });

    return query.getCount();
  }

  findAndCountLoanHistoryFromPerson(
    personId: number,
    findLoanHistoryDto: FindLoanHistoryDto,
  ) {
    return this.loanServiceRepository.count({
      where: {
        person: { id: personId },
      },
      take: findLoanHistoryDto.limit,
      skip: findLoanHistoryDto.page,
    });
  }
}
