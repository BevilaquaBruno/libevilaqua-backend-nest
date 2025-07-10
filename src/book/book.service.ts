import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { FindAuthorBooksDto } from 'src/author/dto/find-author-books.dto';
import { Between, In, Like, Raw, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookServiceRepository: Repository<Book>,
  ) { }
  create(createBookDto: CreateBookDto) {
    let tempCreateBookDto = {
      ...createBookDto,
      type: { id: createBookDto.type_id },
      publisher: { id: createBookDto.publisher_id },
      genre: { id: createBookDto.genre_id },
      authors: [],
      tags: []
    };

    tempCreateBookDto.authors = [];
    for (let i = 0; i < tempCreateBookDto.authors_id.length; i++) {
      const id = tempCreateBookDto.authors_id[i];
      tempCreateBookDto.authors.push({ id: id });
    }

    tempCreateBookDto.tags = [];
    for (let i = 0; i < tempCreateBookDto.tags_id.length; i++) {
      const id = tempCreateBookDto.tags_id[i];
      tempCreateBookDto.tags.push({ id: id });
    }

    return this.bookServiceRepository.save(tempCreateBookDto);
  }

  findAll(findBook: FindBookDto) {
    // initiate the query var and get all the book data
    const query = this.bookServiceRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .where('1 = 1');

    //filter by the tag list - this is called a Gambiarra
    if (findBook.tagList !== null) {
      query
        .leftJoin('book.tags', 'tagsForFilter')
        .andWhere('tagsForFilter.id IN (:...tags)', { tags: findBook.tagList });
    }

    //filter by the author list - this is called a Gambiarra
    if (findBook.authorList !== null) {
      query
        .leftJoin('book.authors', 'authorsForFilter')
        .andWhere('authorsForFilter.id IN (:...authors)', {
          authors: findBook.authorList,
        });
    }

    // filter by publisher id
    if (findBook.publisherList !== null)
      query.andWhere({ publisher: In(findBook.publisherList) });

    // filter by type id
    if (findBook.typeList !== null)
      query.andWhere({ type: In(findBook.typeList) });

    // filter by genre id
    if (findBook.genreList !== null)
      query.andWhere({ genre: In(findBook.genreList) });

    // filter by genre id
    if (findBook.release_year !== null)
      query.andWhere({ release_year: findBook.release_year });

    // filter by number pages
    if (findBook.number_pages !== null)
      query.andWhere({
        number_pages: Between(
          findBook.number_pages[0],
          findBook.number_pages[1],
        ),
      });

    // filter by isbn
    if (findBook.isbn != null) query.andWhere({ isbn: findBook.isbn });

    // filter by edition
    if (findBook.edition != null) query.andWhere({ edition: findBook.edition });

    // filter by title
    if (findBook.title != null)
      query.andWhere({ title: Like(`%${findBook.title}%`) });

    return query.take(findBook.limit).skip(findBook.page).orderBy({ 'book.id': 'DESC' }).getMany();
  }

  findOne(id: number) {
    return this.bookServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    let tempUpdateBookDto = {
      id: id,
      ...updateBookDto,
      type: { id: updateBookDto.type_id },
      publisher: { id: updateBookDto.publisher_id },
      genre: { id: updateBookDto.genre_id },
      authors: [],
      tags: []
    };

    tempUpdateBookDto.authors = [];
    for (let i = 0; i < tempUpdateBookDto.authors_id.length; i++) {
      const id = tempUpdateBookDto.authors_id[i];
      tempUpdateBookDto.authors.push({ id: id });
    }

    tempUpdateBookDto.tags = [];
    for (let i = 0; i < tempUpdateBookDto.tags_id.length; i++) {
      const id = tempUpdateBookDto.tags_id[i];
      tempUpdateBookDto.tags.push({ id: id });
    }
    return await this.bookServiceRepository.save(tempUpdateBookDto);
  }

  async remove(id: number) {
    return await this.bookServiceRepository.delete({ id });
  }

  findBooksFromAuthor(findAuthorBooks: FindAuthorBooksDto) {
    return this.bookServiceRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoin('book.authors', 'authorsForFilter')
      .where('authorsForFilter.id IN (:...authors)', {
        authors: [findAuthorBooks.authorId],
      })
      .take(findAuthorBooks.limit)
      .skip(findAuthorBooks.page)
      .orderBy({ 'book.id': 'DESC' })
      .getMany();
  }

  async count(findBook: FindBookDto) {
    // initiate the query var and get all the book data
    const query = this.bookServiceRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .where('1 = 1');

    //filter by the tag list - this is called a Gambiarra
    if (findBook.tagList !== null) {
      query
        .leftJoin('book.tags', 'tagsForFilter')
        .andWhere('tagsForFilter.id IN (:...tags)', { tags: findBook.tagList });
    }

    //filter by the author list - this is called a Gambiarra
    if (findBook.authorList !== null) {
      query
        .leftJoin('book.authors', 'authorsForFilter')
        .andWhere('authorsForFilter.id IN (:...authors)', {
          authors: findBook.authorList,
        });
    }

    // filter by publisher id
    if (findBook.publisherList !== null)
      query.andWhere({ publisher: In(findBook.publisherList) });

    // filter by type id
    if (findBook.typeList !== null)
      query.andWhere({ type: In(findBook.typeList) });

    // filter by genre id
    if (findBook.genreList !== null)
      query.andWhere({ genre: In(findBook.genreList) });

    // filter by genre id
    if (findBook.release_year !== null)
      query.andWhere({ release_year: findBook.release_year });

    // filter by number pages
    if (findBook.number_pages !== null)
      query.andWhere({
        number_pages: Between(
          findBook.number_pages[0],
          findBook.number_pages[1],
        ),
      });

    // filter by isbn
    if (findBook.isbn != null) query.andWhere({ isbn: findBook.isbn });

    // filter by edition
    if (findBook.edition != null) query.andWhere({ edition: findBook.edition });

    // filter by title
    if (findBook.title != null)
      query.andWhere({ title: Like(`%${findBook.title}%`) });

    return query.getCount();
  }
}
