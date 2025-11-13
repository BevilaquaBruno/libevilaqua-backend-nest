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
    const res = await signin(app).expect(200);

    token = res.body['password'];
  });

  it('POST /auth/select-library - Select Library', async () => {
    await selectLibrary(app, token).expect(201);
  });
});

export async function getAuthToken(app: INestApplication) {
  const resSignIn = await signin(app).expect(200);
  const resLibrary = await selectLibrary(
    app,
    resSignIn.body['password'],
  ).expect(201);
  return resLibrary.body.access_token;
}

function signin(app: INestApplication) {
  return request(app.getHttpServer()).post(`/auth/signin`).send({
    email: userBaseLogin.email,
    password: userBaseLogin.password,
  });
}

function selectLibrary(app: INestApplication, token: string) {
  return request(app.getHttpServer()).post(`/auth/select-library`).send({
    email: userBaseLogin.email,
    password: token,
    libraryId: 1,
  });
}
