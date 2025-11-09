import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('loan E2E', () => {
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

  it('GET /loan?page={{page}}&limit={{limit}}&description={{description}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/loan?page={{page}}&limit={{limit}}&description={{description}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /loan/book/{{id}} - Get current loan from book', async () => {
    const res = await request(app.getHttpServer())
      .get(`/loan/book/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /loan/person/{{id}}/history - Get loan history from person', async () => {
    const res = await request(app.getHttpServer())
      .get(`/loan/person/{{id}}/history`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /loan - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/loan`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "description": "Loan description",
  "return_date": null,
  "must_return_date": "2025-07-20",
  "loan_date": "2025-07-11",
  "bookId": 15,
  "personId": 1
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('PATCH /loan/return/{{id}} - Return Book', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/loan/return/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "return_date": "2025-07-20"
})
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('PATCH /loan/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/loan/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "description": "Loan description abc",
  "return_date": "2025-01-03",
  "must_return_date": "2025-01-04",
  "loan_date": "2025-01-03",
  "bookId": 1,
  "personId": 19
})
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('DELETE /loan/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/loan/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /loan/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/loan/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

});