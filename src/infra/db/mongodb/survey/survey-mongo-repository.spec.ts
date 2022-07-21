import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { AddSurveyModel } from './survey-protocols';

let surveyColletion: Collection;

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

const makeFakeDataSurvey = (): AddSurveyModel => ({
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
