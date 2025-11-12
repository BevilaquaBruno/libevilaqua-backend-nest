import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { publisher1, publisher2 } from './mocks/publisher.mock';

describe('publisher E2E', () => {
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

  it('POST /publisher - Create two publishers', async () => {
    const res1 = await registerPublisher(app, token, publisher1).expect(201);
    publisher1.id = res1.body['id'];

    const res2 = await registerPublisher(app, token, publisher2).expect(201);
    publisher2.id = res2.body['id'];
  });

  it('PATCH /publisher - Update', async () => {
    publisher1.name = "Editora 1 atualizada";

    await request(app.getHttpServer())
      .patch(`/publisher/${publisher1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: publisher1.name,
        country: publisher1.country
      }).expect(200);
  });

  it('GET /publisher - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/publisher`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [publisher2, publisher1],
        count: 2
      });
  });

  it('GET /publisher - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/publisher/${publisher1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(publisher1);
  });

  it('DELETE /publisher - Delete two publishers', async () => {
    await request(app.getHttpServer())
      .delete(`/publisher/${publisher1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/publisher/${publisher2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerPublisher(app, token, publisher) {
  return request(app.getHttpServer())
    .post(`/publisher`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: publisher.name,
      country: publisher.country
    })
}