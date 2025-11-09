import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('author E2E', () => {
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

  it('GET /author/{{author_id}}/books?page={{page}}&limit={{limit}} - Get all books', async () => {
    const res = await request(app.getHttpServer())
      .get(`/author/{{author_id}}/books?page={{page}}&limit={{limit}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('DELETE /author/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/author/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /author/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/author/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /author - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/author`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Roniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad asRoniwalter Jatobá sad as",
  "birth_date": "2025-01-01",
  "death_date": null,
  "bio": null
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('PATCH /author/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/author/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Roniwalter Jatoba",
  "birth_date": null,
  "death_date": null,
  "bio": "Bio do autor aqui"
})
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /author?page={{page}}&limit={{limit}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/author?page={{page}}&limit={{limit}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

});