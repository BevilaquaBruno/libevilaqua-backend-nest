import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { GenreModule } from '../genre/genre.module';
import { PublisherModule } from '../publisher/publisher.module';
import { TypeModule } from '../type/type.module';
import { AuthorModule } from '../author/author.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    GenreModule,
    PublisherModule,
    TypeModule,
    AuthorModule,
    TagModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
