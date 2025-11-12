import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getAuthToken } from './auth.e2e-spec';
import { person1, person2 } from './mocks/person.mock';

describe('person E2E', () => {
  let app: INestApplication;
  let token: string = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    token = await getAuthToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /person - Create two people', async () => {
    const res1 = await registerPerson(app, token, person1).expect(201);
    person1.id = res1.body['id'];

    const res2 = await registerPerson(app, token, person2).expect(201);
    person2.id = res2.body['id'];
  });

  it('PATCH /person - Update', async () => {
    person1.name = "Pessoa 1 Atualizada";
    person1.city = "Florianópolis";

    await request(app.getHttpServer())
      .patch(`/person/${person1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: person1.id,
        name: person1.name,
        document: person1.document,
        zip_code: person1.zip_code,
        state: person1.state,
        city: person1.city,
        district: person1.district,
        street: person1.street,
        number: person1.number,
        obs: person1.obs,
        email: person1.email,
        phone: person1.phone,
        country: person1.country
      }).expect(200);
  });

  it('GET /person - Get all', async () => {
    await request(app.getHttpServer())
      .get(`/person`)
      .set('Authorization', `Bearer ${token}`)
      .expect({
        data: [person2, person1],
        count: 2
      });
  });

  it('GET /person - Get one', async () => {
    await request(app.getHttpServer())
      .get(`/person/${person1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(person1);
  });

  it('DELETE /person - Delete two people', async () => {
    await request(app.getHttpServer())
      .delete(`/person/${person1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/person/${person2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

});

export function registerPerson(app, token, person) {
  return request(app.getHttpServer())
    .post(`/person`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      id: person.id,
      name: person.name,
      document: person.document,
      zip_code: person.zip_code,
      state: person.state,
      city: person.city,
      district: person.district,
      street: person.street,
      number: person.number,
      obs: person.obs,
      email: person.email,
      phone: person.phone,
      country: person.country
    })
}