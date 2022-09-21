import { mockLoadSurveyById } from '@/presentation/mocks';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { HttpRequest } from './load-survey-result-controller-protocols';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  accountId: 'any_account_id',
});

const makeSut = (): any => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);

  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
