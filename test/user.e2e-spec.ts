import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('user E2E', () => {
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

  it('DELETE /user/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/user/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /user?page={{page}}&limit={{limit}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user?page={{page}}&limit={{limit}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /user/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /user/with-library - New with Library', async () => {
    const res = await request(app.getHttpServer())
      .post(`/user/with-library`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "user": {
    "name": "Outro Bruno",
    "email": "bruno-fernando-bevilaquaqq@tuamaeaquelaursa.com",
    "password": "123",
    "verify_password": "123",
    "language": "pt-br"
  },
  "library": {
    "description": "Biblioteca do outro Bruno"
  }
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /user - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/user`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Letícia Voluzia",
  "email": "leticia-voluzia@tuamaeaquelaursa.com",
  "password": "123",
  "verify_password": "123",
  "language": "pt-br"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('PATCH /user/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/user/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Joana Pancini",
  "email": "joana-pancini@tuamaeaquelaursa.com",
  "update_password": false,
  "current_password": "123",
  "password": "1234",
  "verify_password": "1234",
  "language": "en"
})
      .expect(200);
    // you can add more assertions here on res.body
  });

});