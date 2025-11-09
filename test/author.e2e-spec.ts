import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { author1, author2 } from './mocks/author.mock';
import { userBaseLogin } from './mocks/auth.mock';

describe('auth E2E', () => {
  let app: INestApplication;
  let passwordToken: string = null;
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

    passwordToken = res.body['password'];
  });

  it('POST /auth/select-library - Select Library', async () => {
    const res = await request(app.getHttpServer())
      .post(`/auth/select-library`)
      .send({
        "email": userBaseLogin.email,
        "password": passwordToken,
        "libraryId": 1
      })
      .expect(201);

    token = res.body['access_token'];
  });

  it('POST /author - Create two authors', async () => {
    const resAuthor1 = await request(app.getHttpServer())
      .post(`/author`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: author1.name,
        birth_date: author1.birth_date,
        death_date: author1.death_date,
        bio: author1.bio
      }).expect(201);

    author1.id = resAuthor1.body['id'];

    const resAuthor2 = await request(app.getHttpServer())
      .post(`/author`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: author2.name,
        birth_date: author2.birth_date,
        death_date: author2.death_date,
        bio: author2.bio
      }).expect(201);

    author2.id = resAuthor2.body['id'];
  });

  it('PATCH /author - Update', async () => {
    author1.name = "Nome atualizado do primeiro autor";
    author1.bio = "Bio atualizada";

    await request(app.getHttpServer())
      .patch(`/author/${author1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: author1.name,
        birth_date: author1.birth_date,
        death_date: author1.death_date,
        bio: author1.bio
      }).expect(200);
  });

  it('GET /author - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/author`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [author2, author1],
        count: 2
      });
  });

  it('GET /author - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/author/${author1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(author1);
  });

  it('DELETE /author - Delete', async () => {
    await request(app.getHttpServer())
      .delete(`/author/${author2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});