import {
  HttpRequest,
  Validation,
  AddSurvey,
} from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper';
import Mockdate from 'mockdate';
import { mockThrowError } from '@/domain/mocks';
import { mockValidation } from '@/validation/mocks';
import { mockAddSurvey } from '@/presentation/mocks';

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
});

type SutTypes = {
  sut: AddSurveyController;
  validateStub: Validation;
  addSurveyStub: AddSurvey;
};

const makeSut = (): SutTypes => {
  const validateStub = mockValidation();
  const addSurveyStub = mockAddSurvey();
  const sut = new AddSurveyController(validateStub, addSurveyStub);

  return {
    sut,
    validateStub,
    addSurveyStub,
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validateStub } = makeSut();
    const validationSpy = jest.spyOn(validateStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validateStub } = makeSut();
    jest.spyOn(validateStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
