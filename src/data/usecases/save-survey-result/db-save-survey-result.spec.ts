import {
  SaveSurveyResultRepository,
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from './db-save-survey-result-protocols';

import { DbSaveSurveyResult } from './db-save-survey-result';
import mockDate from 'mockdate';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeFakeSurveyResultData = (): SaveSurveyResultParamsModel => ({
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), {
    id: 'valid_id',
  });

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(makeFakeSurveyResult()));
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
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
    await sut.save(makeFakeSurveyResultData());
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResultData());
  });

  test('Should throws DbSaveSurveyResult if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an survey result on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.save(makeFakeSurveyResultData());
    expect(survey).toEqual(makeFakeSurveyResult());
  });
});
