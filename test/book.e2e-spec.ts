import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('book E2E', () => {
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

  it('DELETE /book/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/book/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /book?page={{page}}&limit={{limit}}&status={{status}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/book?page={{page}}&limit={{limit}}&status={{status}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('PATCH /book/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/book/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "title": "Fundamentos da Engenharia de dados",
  "edition": 1,
  "isbn": "9788575228760",
  "number_pages": 528,
  "release_year": 2023,
  "obs": "",
  "genre_id": 3,
  "publisher_id": 1,
  "type_id": 3,
  "authors_id": [
    1,
    2
  ],
  "tags_id": [
    1,
    2
  ],
  "status": true
})
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /book - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/book`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "title": "Fundamentos da Engenharia de dados",
  "edition": 1,
  "isbn": "9788575228760",
  "number_pages": 528,
  "release_year": 3,
  "obs": "",
  "genre_id": 1,
  "publisher_id": 1,
  "type_id": 3,
  "authors_id": [
    1,
    2
  ],
  "tags_id": [
    1
  ],
  "status": true
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('GET /book/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/book/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

});