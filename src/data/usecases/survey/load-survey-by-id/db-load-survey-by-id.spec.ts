import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import mockDate from 'mockdate';
import { mockThrowError, mockSurveyModel } from '@/domain/mocks';
import { mockLoadSurveyByIdRepository } from '@/data/mocks';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepository: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepository = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepository);

  return {
    sut,
    loadSurveyByIdRepository,
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('Should call LoadSurveyByIdRepository ', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveyByIdRepository, 'loadById');
    await sut.loadById('any_id');
    expect(loadAllSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should returns Survey on success ', async () => {
    const { sut } = makeSut();
    const suryey = await sut.loadById('any_id');
    expect(suryey).toEqual(mockSurveyModel());
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepository, 'loadById')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });
});
