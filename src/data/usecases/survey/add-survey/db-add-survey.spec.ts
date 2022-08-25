import { DbAddSurvey } from './db-add-survey';
import {
  AddSurvey,
  AddSurveyParamsModel,
  AddSurveyRepository,
} from './db-add-survey-protocols';
import Mockdate from 'mockdate';
import { mockThrowError } from '@/domain/mocks';
import { mockAddSurveyRepository } from '@/data/mocks';

type SutTypes = {
  sut: AddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeFakeSurveyData = (): AddSurveyParamsModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey UseCase ', () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
