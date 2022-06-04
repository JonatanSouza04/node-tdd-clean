import { HttpRequest } from './add-survey-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { Validation } from '../../../presentation/protocols/validation';

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

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const validateStub = makeValidation();
    const validationSpy = jest.spyOn(validateStub, 'validate');
    const sut = new AddSurveyController(validateStub);
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
