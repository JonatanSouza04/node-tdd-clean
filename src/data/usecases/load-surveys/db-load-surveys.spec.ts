import { DbLoadSurveys } from './db-load-surveys';
import { SurveyModel } from '@/domain/models/survey';
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';
import mockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepository: LoadSurveysRepository;
};

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
  ];
};

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => resolve(makeFakeSurveys()));
    }
  }

  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepository);

  return {
    sut,
    loadSurveysRepository,
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('Should call LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepository } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepository, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test('Should returns a list of Surveys with success ', async () => {
    const { sut } = makeSut();
    const suryeys = await sut.load();
    expect(suryeys).toEqual(makeFakeSurveys());
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut();

    jest
      .spyOn(loadSurveysRepository, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
