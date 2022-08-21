import { SaveSurveyResultRepository } from './db-save-survey-result-protocols';

import { DbSaveSurveyResult } from './db-save-survey-result';
import mockDate from 'mockdate';
import {
  mockThrowError,
  mockSurveyResultModel,
  mockSaveResultSurveyResult,
} from '@/domain/test';
import { mockSaveSurveyResultRepository } from '@/data/test';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
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

  test('Should return an survey result on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.save(mockSaveResultSurveyResult());
    expect(survey).toEqual(mockSurveyResultModel());
  });
});
