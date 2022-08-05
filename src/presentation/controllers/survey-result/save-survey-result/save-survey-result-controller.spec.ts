import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequest,
  SurveyModel,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';
import mockDate from 'mockdate';
import {
  forbidden,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/erros';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
});

const makeFakeRequestAnswerInvalid = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'wrong_answer',
  },
});

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
    },
  ],
  question: 'any_question',
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('Should calls LoadSurveyBy with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());
    expect(spyLoadById).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if LoadSurveyBy returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyBy throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 403 if invalid an answers is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequestAnswerInvalid());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });
});
