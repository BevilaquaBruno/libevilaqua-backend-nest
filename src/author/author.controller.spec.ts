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
import { FindAuthorBooksDto } from './dto/find-author-books.dto';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';

describe('AuthorController', () => {
  let controller: AuthorController;
  const libraryId = 1;
  const req = { user: { libraryId: 1, logged: true, sub: 1, username: 'bruno.f.bevilaqua@gmail.com' } } as any;

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
    const result = await controller.create(req, authorDto);

    expect(result).toEqual({
      id: 1,
      ...authorDto
    });
    expect(mockAuthorService.create).toHaveBeenCalledWith(authorDto, 1);
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
      req,
      findAuthorDto.page.toString(),
      findAuthorDto.limit.toString()
    );

    expect(result).toEqual({
      data: authorList,
      count: authorList.length
    });
    findAuthorDto.page--;
    expect(mockAuthorService.findAll).toHaveBeenCalledWith(findAuthorDto, libraryId);
    expect(mockAuthorService.count).toHaveBeenCalledWith(libraryId);
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
    const result = await controller.findOne(req, authorId.toString());

    // Valida os dados
    expect(result).toEqual(author);
    expect(mockAuthorService.findOne).toHaveBeenCalledWith(authorId, libraryId);
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

    const result = await controller.update(req, authorId.toString(), authorDto);

    expect(result).toEqual(authorDto);
    expect(mockAuthorService.update).toHaveBeenCalledWith(authorId, authorDto, libraryId);
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

    const result = await controller.remove(req, authorId.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'author.general.deleted_with_success',
    });
    expect(mockAuthorService.remove).toHaveBeenCalledWith(authorId, libraryId);
    expect(mockBookService.findBooksFromAuthor).toHaveBeenCalledWith({
      authorId: authorId,
      limit: 1,
      page: 1
    }, libraryId);
  });

  it('Should return all books from an author', async () => {
    // Cria o mock da consulta
    const findAuthorBooks: FindAuthorBooksDto = {
      page: 1,
      limit: 2,
      authorId: 1,
    };

    // Cria o mock e coloca no servico do livro
    const bookList = [{
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      genre: {
        id: 1,
        description: 'Genre test',
      },
      publisher: {
        id: 1,
        name: 'Publisher 1',
        country: 'Brazil'
      },
      type: {
        id: 1,
        descrption: 'Type Test'
      },
      tags: [
        {
          id: 1,
          description: 'Tag Test'
        },
        {
          id: 1,
          description: 'Tag Test 2'
        },
      ],
      authors: [
        {
          name: 'New Author name',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
        },
        {
          name: 'New Author name 2',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2'
        }
      ]
    }];
    mockBookService.findAndCountBooksFromAuthor.mockResolvedValue([bookList, bookList.length]);
    mockAuthorService.findOne.mockResolvedValue({
      id: findAuthorBooks.authorId,
      name: 'a',
      birth_date: new Date('2000-01-01'),
      death_date: new Date('2025-01-01'),
      bio: 'abc'
    });

    // Consulta os livros
    const result = await controller.books(
      req,
      findAuthorBooks.authorId.toString(),
      findAuthorBooks.page.toString(),
      findAuthorBooks.limit.toString()
    );

    // Valida os retornos
    expect(result).toEqual({count: bookList.length, data: bookList});
    findAuthorBooks.page--;
    expect(mockBookService.findAndCountBooksFromAuthor).toHaveBeenCalledWith(findAuthorBooks, libraryId);
    expect(mockAuthorService.findOne).toHaveBeenCalledWith(findAuthorBooks.authorId, libraryId);
  });

});
