import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { user1, user2 } from './mocks/user.mock';

describe('user E2E', () => {
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

  it('POST /user - Create two users', async () => {
    const res1 = await registerUser(app, token, user1).expect(201);
    user1.id = res1.body['id'];

    const res2 = await registerUser(app, token, user2).expect(201);
    user2.id = res2.body['id'];
  });

  it('PATCH /user - Update', async () => {
    user1.name = 'Bruno Temp Atualizado';

    await request(app.getHttpServer())
      .patch(`/user/${user1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: user1.id,
        name: user1.name,
        email: user1.email,
        password: user1.password,
        verify_password: user1.verify_password,
        language: user1.language,
      })
      .expect(200);
  });

  it('GET /user - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [
          {
            id: 1,
            name: 'Bruno Bevilaqua',
            email: 'bruno.f.bevilaqua@gmail.com',
            language: 'pt-br',
          },
          {
            id: user1.id,
            name: user1.name,
            email: user1.email,
            language: user1.language,
          },
          {
            id: user2.id,
            name: user2.name,
            email: user2.email,
            language: user2.language,
          },
        ],
        count: 3,
      });
  });

  it('GET /user - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/user/${user1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        id: user1.id,
        name: user1.name,
        email: user1.email,
        language: user1.language,
      });
  });

  it('DELETE /user - Delete two users', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${user1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/user/${user2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

export function registerUser(app, token, user) {
  return request(app.getHttpServer())
    .post(`/user`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      verify_password: user.verify_password,
      language: user.language,
    });
}
