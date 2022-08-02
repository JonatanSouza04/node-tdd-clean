import {
  SurveyModel,
  LoadSurveyByIdRepository,
} from './db-load-survey-by-id-protocols';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import mockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepository: LoadSurveyByIdRepository;
};

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => resolve(makeFakeSurvey()));
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepository = makeLoadSurveyByIdRepository();
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
    expect(suryey).toEqual(makeFakeSurvey());
  });
});
