import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { type1, type2 } from './mocks/type.mock';

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

  it('POST /type - Create two types', async () => {
    const resType1 = await registerType(app, token, type1).expect(201);
    type1.id = resType1.body['id'];

    const resType2 = await registerType(app, token, type2).expect(201);
    type2.id = resType2.body['id'];
  });

  it('PATCH /type - Update', async () => {
    type1.description = "Tipo 1 atualizado";

    await request(app.getHttpServer())
      .patch(`/type/${type1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: type1.description
      }).expect(200);
  });

  it('GET /type - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/type`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [type2, type1],
        count: 2
      });
  });

  it('GET /type - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/type/${type1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(type1);
  });

  it('DELETE /type - Delete two types', async () => {
    await request(app.getHttpServer())
      .delete(`/type/${type1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/type/${type2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerType(app, token, type) {
  return request(app.getHttpServer())
    .post(`/type`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: type.description
    })
}