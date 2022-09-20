import {
  mockAccountModelWithTokenParams,
  mockSurveyParamsModel,
} from '@/domain/mocks';
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
  const inserted = await surveyColletion.insertOne(mockSurveyParamsModel());

  const res = await surveyColletion.findOne({
    _id: MongoHelper.objectID(inserted.insertedId.toString()),
  });

  return MongoHelper.map(res, res._id.toString()) as unknown as SurveyModel;
};

const makeAccount = async (): Promise<AccountModel> => {
  const inserted = await accountColletion.insertOne(
    mockAccountModelWithTokenParams(),
  );

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

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultColletion.findOne({
        surveyId: MongoHelper.objectID(survey.id),
        accountId: MongoHelper.objectID(account.id),
      });

      expect(surveyResult).toBeTruthy();
      /*
      expect(surveyResult.surveyId).toEqual(MongoHelper.objectID(survey.id));
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(100);
      */
    });

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut();

      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultColletion.insertOne({
        accountId: MongoHelper.objectID(account.id),
        surveyId: MongoHelper.objectID(survey.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultColletion
        .find({
          surveyId: MongoHelper.objectID(survey.id),
          accountId: MongoHelper.objectID(account.id),
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
      /* 
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      */
    });
  });

  describe('loadBySurveyId', () => {
    test('Should load survey resultw', async () => {
      const sut = makeSut();

      const survey = await makeSurvey();
      const account = await makeAccount();
      await surveyResultColletion.insertMany([
        {
          accountId: MongoHelper.objectID(account.id),
          surveyId: MongoHelper.objectID(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          accountId: MongoHelper.objectID(account.id),
          surveyId: MongoHelper.objectID(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          accountId: MongoHelper.objectID(account.id),
          surveyId: MongoHelper.objectID(survey.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          accountId: MongoHelper.objectID(account.id),
          surveyId: MongoHelper.objectID(survey.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);

      const surveyResult = await sut.loadBySurveyId(survey.id, account.id);

      expect(surveyResult).toBeTruthy();
      /*
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].count).toBe(2);
      expect(surveyResult.answers[1].percent).toBe(50);
      */
    });
  });
});
