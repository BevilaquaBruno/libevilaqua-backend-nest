import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('auth E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1) Signin to obtain initial token (returned in `password` field)
    const signinRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'bruno.f.bevilaqua@gmail.com',
        password: '123',
      });
    if (signinRes.status === 201 || signinRes.status === 200) {
      // expecting response body to contain a 'password' field which holds the first JWT
      const tokenA = signinRes.body && signinRes.body.password ? signinRes.body.password : signinRes.body.token;
      // 2) Select library using tokenA as password to receive final access_token
      const selectRes = await request(app.getHttpServer())
        .post('/auth/select-library')
        .send({
          email: 'bruno.f.bevilaqua@gmail.com',
          password: tokenA,
          libraryId: 1,
        });
      token = selectRes.body && selectRes.body.access_token ? selectRes.body.access_token : selectRes.body.token;
    } else {
      // fallback: try to extract token anyway
      const tokenA = signinRes.body && signinRes.body.password ? signinRes.body.password : signinRes.body.token;
      const selectRes = await request(app.getHttpServer())
        .post('/auth/select-library')
        .send({
          email: 'bruno.f.bevilaqua@gmail.com',
          password: tokenA,
          libraryId: 1,
        });
      token = selectRes.body && selectRes.body.access_token ? selectRes.body.access_token : selectRes.body.token;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/confirm-email - Confirm e-mail', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/confirm-email`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "email": "bruno.f.bevilaqua@gmail.com"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /auth/reset-password - Reset Password', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/reset-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "newPassword": "12345",
  "confirmNewPassword": "12345"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('GET /auth/isValid - isValid', async () => {
    const res = await request(app.getHttpServer())
      .get(`/auth/isValid`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /auth/select-library - Select Library', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/select-library`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "email": "bruno.f.bevilaqua@gmail.com",
  "password": "",
  "libraryId": 1
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /auth/signin - Sign in', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/signin`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "email": "bruno.f.bevilaqua@gmail.com",
  "password": "123"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /auth/send-reset-password - Send Reset Password', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/send-reset-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "email": "bruno.f.bevilaqua@gmail.com"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

});