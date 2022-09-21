import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
  mockLoadSurveyResultRepository,
  mockLoadSurveyByIdRepository,
  mockSurveyResultModel,
  mockThrowError,
} from './db-load-survey-result-protocols';

import { DbLoadSurveyResult } from './db-load-survey-result';
import mockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  );
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
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

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.load('any_survey_id', 'any_account_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyResultRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id', 'any_account_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id', 'any_account_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
