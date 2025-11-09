import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('type E2E', () => {
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

  it('GET /type?page={{page}}&limit={{limit}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/type?page={{page}}&limit={{limit}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /type/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/type/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /type - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/type`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "description": "Jornal"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('PATCH /type/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/type/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "description": "Revista"
})
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('DELETE /type/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/type/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

});