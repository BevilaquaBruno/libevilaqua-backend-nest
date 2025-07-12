import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAuthorBooksDto } from 'src/author/dto/find-author-books.dto';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookServiceRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    // Cria um padrão de inserção no banco para o livro - Validar futuramente para alterar o local desse padrão
    const tempCreateBookDto = {
      ...createBookDto,
      type: { id: createBookDto.type_id },
      publisher: { id: createBookDto.publisher_id },
      genre: { id: createBookDto.genre_id },
      authors: [],
      tags: [],
    };

    // Cria um padrão de inserção para os autores - Validar futuramente para alterar o local desse padrão
    tempCreateBookDto.authors = [];
    for (let i = 0; i < tempCreateBookDto.authors_id.length; i++) {
      const id = tempCreateBookDto.authors_id[i];
      tempCreateBookDto.authors.push({ id: id });
    }

    // Cria um padrão de inserção para as tags - Validar futuramente para alterar o local desse padrão
    tempCreateBookDto.tags = [];
    for (let i = 0; i < tempCreateBookDto.tags_id.length; i++) {
      const id = tempCreateBookDto.tags_id[i];
      tempCreateBookDto.tags.push({ id: id });
    }

    // Cria o livro
    return this.bookServiceRepository.save(tempCreateBookDto);
  }

  findAll(findBook: FindBookDto) {
    // Inicia uma constante para a query com as tabelas
    const query = this.bookServiceRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .where('1 = 1');

    // Caso tenha tags na URL - Faz o left join e filtra pelas tags
    if (findBook.tagList !== null) {
      query
        .leftJoin('book.tags', 'tagsForFilter')
        .andWhere('tagsForFilter.id IN (:...tags)', { tags: findBook.tagList });
    }

    // Caso tenha autores na URL - Faz o left join e filtra pelos autores
    if (findBook.authorList !== null) {
      query
        .leftJoin('book.authors', 'authorsForFilter')
        .andWhere('authorsForFilter.id IN (:...authors)', {
          authors: findBook.authorList,
        });
    }

    // Caso tenha uma editora na URL - filtra por ela
    if (findBook.publisherList !== null)
      query.andWhere({ publisher: In(findBook.publisherList) });

    // Caso tenha um tipo na URL - filtra por ele
    if (findBook.typeList !== null)
      query.andWhere({ type: In(findBook.typeList) });

    // Caso tenha um gênero na URL - filtra por ele
    if (findBook.genreList !== null)
      query.andWhere({ genre: In(findBook.genreList) });

    // Caso tenha um ano de lançamento na URL - filtra por ele
    if (findBook.release_year !== null)
      query.andWhere({ release_year: findBook.release_year });

    // Caso tenha tenha número de páginas- Filtra entre os valores informados
    if (findBook.number_pages !== null)
      query.andWhere({
        number_pages: Between(
          findBook.number_pages[0],
          findBook.number_pages[1],
        ),
      });

    // Caso tenha ISBN - Filtra por ele
    if (findBook.isbn != null) query.andWhere({ isbn: findBook.isbn });

    // Caso tenha edição - Filtra por ele
    if (findBook.edition != null) query.andWhere({ edition: findBook.edition });

    // Caso tenha título - Filtra por ele
    if (findBook.title != null)
      query.andWhere({ title: Like(`%${findBook.title}%`) });

    // Retorna a query ordenando pelo id decrescente
    return query
      .take(findBook.limit)
      .skip(findBook.page)
      .orderBy({ 'book.id': 'DESC' })
      .getMany();
  }

  findOne(id: number) {
    return this.bookServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    // Cria um padrão de inserção no banco para o livro - Validar futuramente para alterar o local desse padrão
    const tempUpdateBookDto = {
      id: id,
      ...updateBookDto,
      type: { id: updateBookDto.type_id },
      publisher: { id: updateBookDto.publisher_id },
      genre: { id: updateBookDto.genre_id },
      authors: [],
      tags: [],
    };
    // Cria um padrão de inserção para os autores - Validar futuramente para alterar o local desse padrão
    tempUpdateBookDto.authors = [];
    for (let i = 0; i < tempUpdateBookDto.authors_id.length; i++) {
      const id = tempUpdateBookDto.authors_id[i];
      tempUpdateBookDto.authors.push({ id: id });
    }

    // Cria um padrão de inserção para as tags - Validar futuramente para alterar o local desse padrão
    tempUpdateBookDto.tags = [];
    for (let i = 0; i < tempUpdateBookDto.tags_id.length; i++) {
      const id = tempUpdateBookDto.tags_id[i];
      tempUpdateBookDto.tags.push({ id: id });
    }

    // Retorna o livro salvo
    return await this.bookServiceRepository.save(tempUpdateBookDto);
  }

  async remove(id: number) {
    return await this.bookServiceRepository.delete({ id });
  }

  findBooksFromAuthor(findAuthorBooks: FindAuthorBooksDto) {
    // Retorna todos os livros do autor
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
    // Inicia uma constante para a query com as tabelas
    const query = this.bookServiceRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.type', 'type')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.authors', 'authors')
      .where('1 = 1');

    // Caso tenha tags na URL - Faz o left join e filtra pelas tags
    if (findBook.tagList !== null) {
      query
        .leftJoin('book.tags', 'tagsForFilter')
        .andWhere('tagsForFilter.id IN (:...tags)', { tags: findBook.tagList });
    }

    // Caso tenha autores na URL - Faz o left join e filtra pelos autores
    if (findBook.authorList !== null) {
      query
        .leftJoin('book.authors', 'authorsForFilter')
        .andWhere('authorsForFilter.id IN (:...authors)', {
          authors: findBook.authorList,
        });
    }

    // Caso tenha uma editora na URL - filtra por ela
    if (findBook.publisherList !== null)
      query.andWhere({ publisher: In(findBook.publisherList) });

    // Caso tenha um tipo na URL - filtra por ele
    if (findBook.typeList !== null)
      query.andWhere({ type: In(findBook.typeList) });

    // Caso tenha um gênero na URL - filtra por ele
    if (findBook.genreList !== null)
      query.andWhere({ genre: In(findBook.genreList) });

    // Caso tenha um ano de lançamento na URL - filtra por ele
    if (findBook.release_year !== null)
      query.andWhere({ release_year: findBook.release_year });

    // Caso tenha tenha número de páginas- Filtra entre os valores informados
    if (findBook.number_pages !== null)
      query.andWhere({
        number_pages: Between(
          findBook.number_pages[0],
          findBook.number_pages[1],
        ),
      });

    // Caso tenha ISBN - Filtra por ele
    if (findBook.isbn != null) query.andWhere({ isbn: findBook.isbn });

    // Caso tenha edição - Filtra por ele
    if (findBook.edition != null) query.andWhere({ edition: findBook.edition });

    // Caso tenha título - Filtra por ele
    if (findBook.title != null)
      query.andWhere({ title: Like(`%${findBook.title}%`) });

    // Retorna a query ordenando pelo id decrescente
    return query.getCount();
  }
}
