import { DbAddSurvey } from './db-add-survey';
import {
  AddSurvey,
  AddSurveyModel,
  AddSurveyRespository,
} from './db-add-survey-protocols';

interface SutTypes {
  sut: AddSurvey;
  addSurveyRepositoryStub: AddSurveyRespository;
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
});

const makeAddSurveyRepositoryStub = (): AddSurveyRespository => {
  class AddSurveyRepositoryStub implements AddSurveyRespository {
    async add(data: AddSurveyModel): Promise<void> {
      return await new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey UseCase ', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});
