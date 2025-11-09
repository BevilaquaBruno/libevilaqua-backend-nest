import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('report E2E', () => {
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

  it('POST /report/author-list - Author List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/author-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/book-list - Book List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/book-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/loan-list?book={{book}} - Loan list', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/loan-list?book={{book}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/person-list - Person List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/person-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/publisher-list - Publisher List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/publisher-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('GET /report - Report List', async () => {
    const res = await request(app.getHttpServer())
      .get(`/report`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /report/tag-list - Tag List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/tag-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/type-list - Type List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/type-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/user-list - User List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/user-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('POST /report/genre-list - Genre List', async () => {
    const res = await request(app.getHttpServer())
      .post(`/report/genre-list`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    // you can add more assertions here on res.body
  });

});