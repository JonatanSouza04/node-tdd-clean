import { HttpRequest, Validation } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest } from '../../helpers/http/http-helper';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: AddSurveyController;
  validateStub: Validation;
}

const makeSut = (): SutTypes => {
  const validateStub = makeValidation();
  const sut = new AddSurveyController(validateStub);

  return {
    sut,
    validateStub,
  };
};

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validateStub } = makeSut();
    const validationSpy = jest.spyOn(validateStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validateStub } = makeSut();
    jest.spyOn(validateStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });
});
