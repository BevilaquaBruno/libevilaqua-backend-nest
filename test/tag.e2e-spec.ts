import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { tag1, tag2 } from './mocks/tag.mock';

describe('type E2E', () => {
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

  it('POST /tag - Create two tags', async () => {
    const res1 = await registerTag(app, token, tag1).expect(201);
    tag1.id = res1.body['id'];

    const res2 = await registerTag(app, token, tag2).expect(201);
    tag2.id = res2.body['id'];
  });

  it('PATCH /tag - Update', async () => {
    tag1.description = "Tipo 1 atualizado";

    await request(app.getHttpServer())
      .patch(`/tag/${tag1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: tag1.description
      }).expect(200);
  });

  it('GET /tag - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/tag`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [tag2, tag1],
        count: 2
      });
  });

  it('GET /tag - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/tag/${tag1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(tag1);
  });

  it('DELETE /tag - Delete two tags', async () => {
    await request(app.getHttpServer())
      .delete(`/tag/${tag1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/tag/${tag2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerTag(app, token, tag) {
  return request(app.getHttpServer())
    .post(`/tag`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: tag.description
    })
}