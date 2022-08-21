import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys/load-surveys-repository';
import mockDate from 'mockdate';
import { mockThrowError, mockSurveysModels } from '@/domain/test';
import { mockLoadSurveysRepository } from '@/data/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepository: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepository = mockLoadSurveysRepository();
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
    expect(suryeys).toEqual(mockSurveysModels());
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut();

    jest
      .spyOn(loadSurveysRepository, 'loadAll')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
