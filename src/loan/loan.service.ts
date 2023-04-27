import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private loanServiceRepository: Repository<Loan>,
  ) {}
  create(createLoanDto: CreateLoanDto) {
    return this.loanServiceRepository.save(createLoanDto);
  }

  findAll() {
    return this.loanServiceRepository.find();
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
}
