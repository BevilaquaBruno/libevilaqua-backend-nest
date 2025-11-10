import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { genre1, genre2 } from './mocks/genre.mock';

describe('genre E2E', () => {
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

  it('POST /genre - Create two genres', async () => {
    const resGenre1 = await registerGenre(app, token, genre1).expect(201);
    genre1.id = resGenre1.body['id'];

    const resGenre2 = await registerGenre(app, token, genre2).expect(201);
    genre2.id = resGenre2.body['id'];
  });

  it('PATCH /genre - Update', async () => {
    genre1.description = "Gênero 1 atualizado";

    await request(app.getHttpServer())
      .patch(`/genre/${genre1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: genre1.description
      }).expect(200);
  });

  it('GET /genre - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/genre`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [genre2, genre1],
        count: 2
      });
  });

  it('GET /genre - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/genre/${genre1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(genre1);
  });

  it('DELETE /genre - Delete two genres', async () => {
    await request(app.getHttpServer())
      .delete(`/genre/${genre1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/genre/${genre2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerGenre(app, token, genre) {
  return request(app.getHttpServer())
    .post(`/genre`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: genre.description
    })
}