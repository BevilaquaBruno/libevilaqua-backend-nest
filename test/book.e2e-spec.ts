import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { book1, book2 } from './mocks/book.mock';
import { registerType } from './type.e2e-spec';
import { type1, type2 } from './mocks/type.mock';
import { registerPublisher } from './publisher.e2e-spec';
import { publisher1, publisher2 } from './mocks/publisher.mock';
import { registerGenre } from './genre.e2e-spec';
import { genre1, genre2 } from './mocks/genre.mock';
import { registerAuthor } from './author.e2e-spec';
import { author1, author2 } from './mocks/author.mock';
import { registerTag } from './tag.e2e-spec';
import { tag1, tag2 } from './mocks/tag.mock';
import { registerPerson } from './person.e2e-spec';
import { person1, person2 } from './mocks/person.mock';

describe('book E2E', () => {
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

  it('POST /book - Create two books', async () => {
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
  });

  it('PATCH /book - Update', async () => {
    book1.title = "Título do livro 1 atualizado";
    book1.edition = 55;
    book1.number_pages = 64;
    book1.obs = "Observação atualizada como teste.";

    await request(app.getHttpServer())
      .patch(`/book/${book1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: book1.title,
        edition: book1.edition,
        isbn: book1.isbn,
        number_pages: book1.number_pages,
        release_year: book1.release_year,
        obs: book1.obs,
        genre_id: book1.genre_id,
        publisher_id: book1.publisher_id,
        type_id: book1.type_id,
        authors_id: book1.authors_id,
        tags_id: book1.tags_id,
        status: book1.status
      }).expect(200);
  });

  it('GET /book - Get all', async () => {
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
    }

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
    }

    await request(app.getHttpServer())
      .get(`/book`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [book2Completed, book1Completed],
        count: 2
      });
  });

  it('GET /book - Get one', async () => {
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
    }
    await request(app.getHttpServer())
      .get(`/book/${book1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(book1Completed);
  });

  it('DELETE /book - Delete two books', async () => {
    await request(app.getHttpServer())
      .delete(`/book/${book1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/book/${book2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerBook(app, token, book) {
  return request(app.getHttpServer())
    .post(`/book`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: book.title,
      edition: book.edition,
      isbn: book.isbn,
      number_pages: book.number_pages,
      release_year: book.release_year,
      obs: book.obs,
      genre_id: book.genre_id,
      publisher_id: book.publisher_id,
      type_id: book.type_id,
      authors_id: book.authors_id,
      tags_id: book.tags_id,
      status: book.status
    })
}