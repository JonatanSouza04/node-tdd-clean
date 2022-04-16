import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

let accountColletion: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid_name',
          email: 'valid_email@gmail.com',
          password: '1234',
          passwordConfirm: '1234',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const hashPassword = await hash('1234', 12);

      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: hashPassword,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: '1234',
        })
        .expect(200);
    });

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_error',
        })
        .expect(401);
    });
  });
});
