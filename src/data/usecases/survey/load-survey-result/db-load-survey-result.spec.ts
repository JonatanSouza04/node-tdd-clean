import {
  mockLoadSurveyResultRepository,
  LoadSurveyResultRepository,
} from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { mockSurveyResultModel, mockThrowError } from '@/domain/mocks';
import mockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    await sut.load('any_survey_id', 'any_account_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      'any_survey_id',
      'any_account_id',
    );
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id', 'any_account_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.load('any_survey_id', 'any_account_id');
    await expect(promise).rejects.toThrow();
  });
});
