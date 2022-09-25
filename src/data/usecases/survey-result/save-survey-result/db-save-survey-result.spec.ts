import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from './db-save-survey-result-protocols';

import { DbSaveSurveyResult } from './db-save-survey-result';
import mockDate from 'mockdate';
import {
  mockThrowError,
  mockSurveyResultModel,
  mockSaveResultSurveyResult,
} from '@/domain/mocks';
import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository,
} from '@/data/mocks';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call SaveSurveyResultRepository wiht correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    await sut.save(mockSaveResultSurveyResult());
    expect(saveSpy).toHaveBeenCalledWith(mockSaveResultSurveyResult());
  });

  test('Should throws DbSaveSurveyResult if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.save(mockSaveResultSurveyResult());
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyRespository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    const survey = mockSaveResultSurveyResult();
    await sut.save(survey);
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      survey.surveyId,
      survey.accountId,
    );
  });

  test('Should return throw if LoadSurveyRespository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.save(mockSaveResultSurveyResult());
    expect(promise).rejects.toThrow();
  });

  test('Should return an survey result on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.save(mockSaveResultSurveyResult());
    expect(survey).toEqual(mockSurveyResultModel());
  });
});
