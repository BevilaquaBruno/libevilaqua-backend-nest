import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { userBaseLogin } from './mocks/auth.mock';

describe('auth E2E', () => {
  let app: INestApplication;
  let token: string = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signin - Sign in', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({
        email: userBaseLogin.email,
        password: userBaseLogin.password
      }).expect(200);

    token = res.body['password'];
  });

  it('POST /auth/select-library - Select Library', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/select-library`)
      .send({
        "email": userBaseLogin.email,
        "password": token,
        "libraryId": 1
      })
      .expect(201);
  });

});