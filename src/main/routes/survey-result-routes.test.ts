import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';
import { AddSurveyModel } from '@/domain/models/survey';

let surveyColletion: Collection;
let accountColletion: Collection;

const makeFakeDataSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
    },
  ],
});

const makeAccessToken = async (): Promise<string> => {
  const res = await accountColletion.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: '123',
    role: 'admin',
  });

  const id = res.insertedId.toString();
  const accessToken = sign({ id }, env.jwtSecret);

  await accountColletion.updateOne(
    { _id: MongoHelper.objectID(id) },
    {
      $set: {
        accessToken,
      },
    },
  );

  return accessToken;
};

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoURL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys');
    await surveyColletion.deleteMany({});

    accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });
  });
});