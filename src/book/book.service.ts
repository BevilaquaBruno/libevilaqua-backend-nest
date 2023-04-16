import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookServiceRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    this.bookServiceRepository.save(createBookDto);
  }

  findAll() {
    return this.bookServiceRepository.find();
  }

  findOne(id: number) {
    return this.bookServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return await this.bookServiceRepository.save(updateBookDto);
  }

  async remove(id: number) {
    return await this.bookServiceRepository.delete({ id });
  }
}
