import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../book/entities/book.entity';
import { BookService } from '../book/book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [AuthorController],
  providers: [AuthorService, BookService],
  exports: [AuthorService],
})
export class AuthorModule {}
