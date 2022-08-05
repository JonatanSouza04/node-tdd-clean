import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequest,
  SurveyModel,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';
import mockDate from 'mockdate';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
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
});
