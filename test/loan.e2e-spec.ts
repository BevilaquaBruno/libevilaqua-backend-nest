import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { loan1, loan2 } from './mocks/loan.mock';
import { registerType } from './type.e2e-spec';
import { type1, type2 } from './mocks/type.mock';
import { registerPublisher } from './publisher.e2e-spec';
import { publisher1, publisher2 } from './mocks/publisher.mock';
import { registerGenre } from './genre.e2e-spec';
import { genre1, genre2 } from './mocks/genre.mock';
import { author1, author2 } from './mocks/author.mock';
import { registerAuthor } from './author.e2e-spec';
import { tag1, tag2 } from './mocks/tag.mock';
import { registerTag } from './tag.e2e-spec';
import { registerPerson } from './person.e2e-spec';
import { person1, person2 } from './mocks/person.mock';
import { registerBook } from './book.e2e-spec';
import { book1, book2 } from './mocks/book.mock';
import * as moment from 'moment';

describe('loan E2E', () => {
  const currentDate = moment();
  let app: INestApplication;
  let token: string = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /loan - Create two loans', async () => {
    // Cria os registros para o livro
    const resType1 = await registerType(app, token, type1);
    type1.id = resType1.body['id'];
    const resType2 = await registerType(app, token, type2);
    type2.id = resType2.body['id'];

    const resPublisher1 = await registerPublisher(app, token, publisher1);
    publisher1.id = resPublisher1.body['id'];
    const resPublisher2 = await registerPublisher(app, token, publisher2);
    publisher2.id = resPublisher2.body['id'];

    const resGenre1 = await registerGenre(app, token, genre1);
    genre1.id = resGenre1.body['id'];
    const resGenre2 = await registerGenre(app, token, genre2);
    genre2.id = resGenre2.body['id'];

    const resAuthor1 = await registerAuthor(app, token, author1);
    author1.id = resAuthor1.body['id'];
    const resAuthor2 = await registerAuthor(app, token, author2);
    author2.id = resAuthor2.body['id'];

    const resTag1 = await registerTag(app, token, tag1);
    tag1.id = resTag1.body['id'];
    const resTag2 = await registerTag(app, token, tag2);
    tag2.id = resTag2.body['id'];

    // Cria os registros para o empréstimo
    book1.type_id = type1.id;
    book1.genre_id = genre1.id;
    book1.publisher_id = publisher1.id;
    book1.authors_id = [author1.id];
    book1.tags_id = [tag1.id];
    const resBook1 = await registerBook(app, token, book1).expect(201);
    book1.id = resBook1.body['id'];
    book2.type_id = type2.id;
    book2.genre_id = genre2.id;
    book2.publisher_id = publisher2.id;
    book2.authors_id = [author1.id, author2.id];
    book2.tags_id = [tag1.id, tag2.id];
    const resBook2 = await registerBook(app, token, book2).expect(201);
    book2.id = resBook2.body['id'];

    const resPerson1 = await registerPerson(app, token, person1);
    person1.id = resPerson1.body['id'];
    const resPerson2 = await registerPerson(app, token, person2);
    person2.id = resPerson2.body['id'];

    // Empréstimo 1
    loan1.bookId = book1.id;
    loan1.personId = person1.id;
    const res1 = await registerLoan(app, token, loan1).expect(201);
    loan1.id = res1.body['id'];

    // Empréstimo 2
    loan2.bookId = book2.id;
    loan2.personId = person2.id;
    const res2 = await registerLoan(app, token, loan2).expect(201);
    loan2.id = res2.body['id'];
  });

  it('PATCH /loan - Update', async () => {
    loan1.description = 'Descrição do empréstimo 1 atualizada';
    loan1.must_return_date = currentDate.add('3M').format('YYYY-MM-DD');

    await request(app.getHttpServer())
      .patch(`/loan/${loan1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: loan1.id,
        description: loan1.description,
        return_date: loan1.return_date,
        must_return_date: loan1.must_return_date,
        loan_date: loan1.loan_date,
        bookId: loan1.bookId,
        personId: loan1.personId,
      })
      .expect(200);
  });

  it('GET /loan - Get all', async () => {
    const book1Completed = {
      id: book1.id,
      title: book1.title,
      edition: book1.edition,
      isbn: book1.isbn,
      number_pages: book1.number_pages,
      release_year: book1.release_year,
      obs: book1.obs,
      status: book1.status,
      genre: genre1,
      publisher: publisher1,
      type: type1,
      tags: [tag1],
      authors: [author1],
    };

    const book2Completed = {
      id: book2.id,
      title: book2.title,
      edition: book2.edition,
      isbn: book2.isbn,
      number_pages: book2.number_pages,
      release_year: book2.release_year,
      obs: book2.obs,
      status: book2.status,
      genre: genre2,
      publisher: publisher2,
      type: type2,
      tags: [tag1, tag2],
      authors: [author1, author2],
    };

    const loan1Completed = {
      id: loan1.id,
      description: loan1.description,
      return_date: loan1.return_date,
      must_return_date: loan1.must_return_date,
      loan_date: loan1.loan_date,
      book: book1Completed,
      person: person1,
    };

    const loan2Completed = {
      id: loan2.id,
      description: loan2.description,
      return_date: loan2.return_date,
      must_return_date: loan2.must_return_date,
      loan_date: loan2.loan_date,
      book: book2Completed,
      person: person2,
    };
    await request(app.getHttpServer())
      .get(`/loan`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [loan2Completed, loan1Completed],
        count: 2,
      });
  });

  it('GET /loan - Get one', async () => {
    const book1Completed = {
      id: book1.id,
      title: book1.title,
      edition: book1.edition,
      isbn: book1.isbn,
      number_pages: book1.number_pages,
      release_year: book1.release_year,
      obs: book1.obs,
      status: book1.status,
      genre: genre1,
      publisher: publisher1,
      type: type1,
      tags: [tag1],
      authors: [author1],
    };

    const loan1Completed = {
      id: loan1.id,
      description: loan1.description,
      return_date: loan1.return_date,
      must_return_date: loan1.must_return_date,
      loan_date: loan1.loan_date,
      book: book1Completed,
      person: person1,
    };
    await request(app.getHttpServer())
      .get(`/loan/${loan1Completed.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(loan1Completed);
  });

  it('GET /loan - Get current loan from book', async () => {
    const book1Completed = {
      id: book1.id,
      title: book1.title,
      edition: book1.edition,
      isbn: book1.isbn,
      number_pages: book1.number_pages,
      release_year: book1.release_year,
      obs: book1.obs,
      status: book1.status,
      genre: genre1,
      publisher: publisher1,
      type: type1,
      tags: [tag1],
      authors: [author1],
    };

    const loan1Completed = {
      id: loan1.id,
      description: loan1.description,
      return_date: loan1.return_date,
      must_return_date: loan1.must_return_date,
      loan_date: loan1.loan_date,
      book: book1Completed,
      person: person1,
    };
    await request(app.getHttpServer())
      .get(`/loan/book/${book1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(loan1Completed);
  });

  it('GET /loan - Get loan history from person', async () => {
    const book2Completed = {
      id: book2.id,
      title: book2.title,
      edition: book2.edition,
      isbn: book2.isbn,
      number_pages: book2.number_pages,
      release_year: book2.release_year,
      obs: book2.obs,
      status: book2.status,
      genre: genre2,
      publisher: publisher2,
      type: type2,
      tags: [tag1, tag2],
      authors: [author1, author2],
    };

    const loan2Completed = {
      id: loan2.id,
      description: loan2.description,
      return_date: loan2.return_date,
      must_return_date: loan2.must_return_date,
      loan_date: loan2.loan_date,
      book: book2Completed,
      person: person2,
    };
    await request(app.getHttpServer())
      .get(`/loan/person/${person2.id}/history`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [loan2Completed],
        count: 1,
      });
  });

  it('PATCH /loan - Return a book', async () => {
    await request(app.getHttpServer())
      .patch(`/loan/return/${loan1.id}`)
      .send({
        return_date: moment().add('5days').format('YYYY-MM-DD'),
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('DELETE /loan - Delete two loans', async () => {
    await request(app.getHttpServer())
      .delete(`/loan/${loan1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/loan/${loan2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

export function registerLoan(app, token, loan) {
  return request(app.getHttpServer())
    .post(`/loan`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: loan.description,
      return_date: loan.return_date,
      must_return_date: loan.must_return_date,
      loan_date: loan.loan_date,
      bookId: loan.bookId,
      personId: loan.personId,
    });
}
