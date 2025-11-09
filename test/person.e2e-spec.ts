import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const BASE_URL = 'http://localhost:3000';

describe('person E2E', () => {
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

  it('GET /person?page={{page}}&limit={{limit}} - Get all', async () => {
    const res = await request(app.getHttpServer())
      .get(`/person?page={{page}}&limit={{limit}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('DELETE /person/{{id}} - Delete', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/person/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('GET /person/{{id}} - Get one', async () => {
    const res = await request(app.getHttpServer())
      .get(`/person/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // you can add more assertions here on res.body
  });

  it('POST /person - New', async () => {
    const res = await request(app.getHttpServer())
      .post(`/person`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Sem telefone",
  "cpf": null,
  "cep": null,
  "state": null,
  "city": null,
  "district": null,
  "street": null,
  "number": null,
  "obs": null,
  "email": "bbevilaqua@gmail.com",
  "phone": "49920011913"
})
      .expect(201);
    // you can add more assertions here on res.body
  });

  it('PATCH /person/{{id}} - Update', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/person/{{id}}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
  "name": "Bruno Fernando Bevilaqua",
  "cpf": "103.411.729-79",
  "cep": "89701-875",
  "state": "SC",
  "city": "Concórdia",
  "district": "Linha São Paulo",
  "street": "Rua Sérgio Galvan",
  "number": "15",
  "obs": null,
  "email": null,
  "phone": "49920011913"
})
      .expect(200);
    // you can add more assertions here on res.body
  });

});