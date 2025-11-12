import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { author1, author2 } from './mocks/author.mock';
import { getAuthToken } from './auth.e2e-spec';
import { registerType } from './type.e2e-spec';
import { type1 } from './mocks/type.mock';
import { registerPublisher } from './publisher.e2e-spec';
import { publisher1 } from './mocks/publisher.mock';
import { registerGenre } from './genre.e2e-spec';
import { genre1 } from './mocks/genre.mock';
import { registerTag } from './tag.e2e-spec';
import { tag1 } from './mocks/tag.mock';
import { book1 } from './mocks/book.mock';
import { registerBook } from './book.e2e-spec';

describe('author E2E', () => {
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

  it('POST /author - Create two authors', async () => {
    const resAuthor1 = await registerAuthor(app, token, author1).expect(201);
    author1.id = resAuthor1.body['id'];

    const resAuthor2 = await registerAuthor(app, token, author2).expect(201);
    author2.id = resAuthor2.body['id'];
  });

  it('PATCH /author - Update', async () => {
    author1.name = "Nome atualizado do primeiro autor";
    author1.bio = "Bio atualizada";

    await request(app.getHttpServer())
      .patch(`/author/${author1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: author1.name,
        birth_date: author1.birth_date,
        death_date: author1.death_date,
        bio: author1.bio
      }).expect(200);
  });

  it('GET /author - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/author`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [author2, author1],
        count: 2
      });
  });

  it('GET /author - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/author/${author1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(author1);
  });

  it('DELETE /author - Delete two authors', async () => {
    await request(app.getHttpServer())
      .delete(`/author/${author1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/author/${author2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  // O teste a seguir fica no arquivo de testes do livro
  //GET /author - Get all books

});

export function registerAuthor(app, token, author) {
  return request(app.getHttpServer())
    .post(`/author`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: author.name,
      birth_date: author.birth_date,
      death_date: author.death_date,
      bio: author.bio
    })
}