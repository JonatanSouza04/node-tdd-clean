import { Collection } from 'mongodb';
import { AccountModel } from '../account/account-protocols';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyModel } from '../survey/survey-mongo-repository-protocols';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyColletion: Collection;
let accountColletion: Collection;
let surveyResultColletion: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const inserted = await surveyColletion.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  });

  const res = await surveyColletion.findOne({
    _id: MongoHelper.objectID(inserted.insertedId.toString()),
  });

  return MongoHelper.map(res, res._id.toString()) as unknown as SurveyModel;
};

const makeAccount = async (): Promise<AccountModel> => {
  const inserted = await accountColletion.insertOne({
    name: 'any_name',
    email: 'any_email@imail.com',
    password: 'any_password',
    accessToken: 'any_token',
  });

  const res = await accountColletion.findOne({
    _id: MongoHelper.objectID(inserted.insertedId.toString()),
  });

  return MongoHelper.map(res, res._id.toString()) as unknown as AccountModel;
};

describe('SurveyResult Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys');
    await surveyColletion.deleteMany({});

    surveyResultColletion = await MongoHelper.getCollection('surveyResults');
    await surveyResultColletion.deleteMany({});

    accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.deleteMany({});
  });

  describe('save()', () => {
    test('Should save a survey result if its new', async () => {
      const sut = makeSut();

      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });
  });
});
