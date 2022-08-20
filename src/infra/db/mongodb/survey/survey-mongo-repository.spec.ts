import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { AddSurveyParamsModel } from './survey-mongo-repository-protocols';

let surveyColletion: Collection;

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

const makeFakeDataSurvey = (): AddSurveyParamsModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
    },
    {
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys');
    await surveyColletion.deleteMany({});
  });

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      const surveyDataFake = makeFakeDataSurvey();
      const spySurveyAdd = jest.spyOn(sut, 'add');
      await sut.add(surveyDataFake);

      const survey = await surveyColletion.findOne({
        question: 'any_question',
      });

      expect(spySurveyAdd).toHaveBeenCalledWith(surveyDataFake);
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll', () => {
    test('Should loadAll surveys on success', async () => {
      await surveyColletion.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
          ],
          date: new Date(),
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer',
            },
          ],
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
    });

    test('Should loadAll empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById', () => {
    test('Should loadById survey on success', async () => {
      const res = await surveyColletion.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      });
      const id = res.insertedId.toString();
      const sut = makeSut();
      const survey = await sut.loadById(id);

      expect(survey).toBeTruthy();
      expect(survey.question).toEqual('any_question');
    });

    test('Should loadById return empty', async () => {
      const sut = makeSut();
      const survey = await sut.loadById('any_id_empty');

      expect(survey).toBeFalsy();
    });
  });
});
