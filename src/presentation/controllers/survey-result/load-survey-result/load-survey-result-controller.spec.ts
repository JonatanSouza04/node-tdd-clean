import {
  mockReturnNull,
  mockSurveyResultModel,
  mockThrowError,
} from '@/domain/mocks';
import { InvalidParamError } from '@/presentation/erros';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/mocks';
import {
  LoadSurveyResultController,
  Request,
} from './load-survey-result-controller';
import {
  LoadSurveyById,
  LoadSurveyResult,
} from './load-survey-result-controller-protocols';
import mockDate from 'mockdate';

const mockRequest = (): Request => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
});

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub,
  );

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(mockReturnNull);

    const request = await sut.handle(mockRequest());
    expect(request).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 400 if not exists param suveryId', async () => {
    const { sut } = makeSut();

    const request = await sut.handle({
      accountId: 'any_account_id',
      surveyId: null,
    });
    expect(request).toEqual(badRequest(new InvalidParamError('surveyId')));
  });

  test('Should return 500s if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(mockThrowError);
    const request = await sut.handle(mockRequest());
    expect(request).toEqual(serverError(new Error()));
  });

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id');
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();
    const request = await sut.handle(mockRequest());
    expect(request).toEqual(ok(mockSurveyResultModel()));
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    jest
      .spyOn(loadSurveyResultStub, 'load')
      .mockImplementationOnce(mockThrowError);
    const request = await sut.handle(mockRequest());
    expect(request).toEqual(serverError(new Error()));
  });
});
