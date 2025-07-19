import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { mockAuthorService } from './mocks/author.service.mock';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { BookService } from '../book/book.service';
import { mockBookService } from '../book/mocks/book.service.mock';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAuthorDto } from './dto/find-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindAuthorBooksDto } from './dto/find-author-books.dto';
import { Book } from 'src/book/entities/book.entity';

describe('AuthorController', () => {
  let controller: AuthorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthorService, useValue: mockAuthorService },
        { provide: BookService, useValue: mockBookService }
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new author', async () => {
    // Cria o dto do autor
    const authorDto: CreateAuthorDto = {
      name: 'New Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockAuthorService.create.mockResolvedValue({
      id: 1,
      ...authorDto
    });
    const result = await controller.create(authorDto);

    expect(result).toEqual({
      id: 1,
      ...authorDto
    });
    expect(mockAuthorService.create).toHaveBeenCalledWith(authorDto);
  });

  it('Should return all authors', async () => {
    // Cria os mocks para os autores e a quantidade de autores
    const authorList: UpdateAuthorDto[] = [
      {
        id: 1,
        name: 'New Author name',
        birth_date: new Date('2000-01-01'),
        death_date: new Date('2025-01-01'),
        bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
      },
      {
        id: 2,
        name: 'New Author with other name',
        birth_date: new Date('2001-01-01'),
        death_date: new Date('2023-01-01'),
        bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text again'
      }
    ];
    const authorQuantity = authorList.length;

    // Insere os mocks nos serviços
    mockAuthorService.findAll.mockResolvedValue(authorList);
    mockAuthorService.count.mockResolvedValue(authorQuantity);

    // Cria o mock para o findAuthor e faz a requisição
    const findAuthorDto: FindAuthorDto = {
      page: 1,
      limit: 2,
    };
    const result = await controller.findAll(
      findAuthorDto.page.toString(),
      findAuthorDto.limit.toString()
    );

    expect(result).toEqual({
      data: authorList,
      count: authorList.length
    });
    findAuthorDto.page--;
    expect(mockAuthorService.findAll).toHaveBeenCalledWith(findAuthorDto);
  });

  it('Should return one author', async () => {
    // Cria um mock para um autor
    const author: UpdateAuthorDto = {
      id: 1,
      name: 'Author name',
      birth_date: new Date('2001-01-01'),
      death_date: new Date('2023-01-01'),
      bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text again'
    };

    // Insere os mocks nos serviços
    mockAuthorService.findOne.mockResolvedValue(author);

    // Cria o mock da consulta e consulta a pessoa
    const authorId = 1;
    const result = await controller.findOne(authorId.toString());

    // Valida os dados
    expect(result).toEqual(author);
    expect(mockAuthorService.findOne).toHaveBeenCalledWith(authorId);
  });

  it('Should edit an author', async () => {
    // Cria o dto do autor
    const authorId = 1;
    const authorDto: UpdateAuthorDto = {
      id: authorId,
      name: 'Edit Author name',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockAuthorService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockAuthorService.findOne.mockResolvedValue(authorDto);

    const result = await controller.update(authorId.toString(), authorDto);

    expect(result).toEqual(authorDto);
    expect(mockAuthorService.update).toHaveBeenCalledWith(authorId, authorDto);
  });

  it('Should remove an author', async () => {
    // Cria o id
    const authorId = 1;

    // Mocka o resultado
    mockAuthorService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockBookService.findBooksFromAuthor.mockResolvedValue([]);
    mockAuthorService.findOne.mockResolvedValue({
      id: authorId,
      name: 'a',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'abc'
    });

    const result = await controller.remove(authorId.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Autor deletado com sucesso.',
    });
    expect(mockAuthorService.remove).toHaveBeenCalledWith(authorId);
    expect(mockBookService.findBooksFromAuthor).toHaveBeenCalledWith({
      page: 1,
      limit: 1,
      authorId: authorId,
    });
  });

  it('Should return all books from an author', async () => {
    // Cria o mock da consulta
    const findAuthorBooks: FindAuthorBooksDto = {
      page: 1,
      limit: 2,
      authorId: 1,
    };

    // Cria o mock e coloca no servico do livro
    const bookList: Book[] = [];
    mockBookService.findBooksFromAuthor.mockResolvedValue(bookList);
    mockAuthorService.findOne.mockResolvedValue({
      id: findAuthorBooks.authorId,
      name: 'a',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'abc'
    });

    // Consulta os livros
    const result = await controller.books(
      findAuthorBooks.authorId.toString(),
      findAuthorBooks.page.toString(),
      findAuthorBooks.limit.toString()
    );

    // Valida os retornos
    expect(result).toEqual(bookList);
    findAuthorBooks.page--;
    expect(mockBookService.findBooksFromAuthor).toHaveBeenCalledWith(findAuthorBooks);
  });

});
