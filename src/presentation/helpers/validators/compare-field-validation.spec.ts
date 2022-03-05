import { InvalidParamError } from '../../erros';
import { CompareFieldValidation } from './compare-field-validation';
import { Validation } from './validation';

interface SutTypes {
  sut: Validation;
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidation('password', 'confirmPassword');

  return {
    sut,
  };
};

describe('Compare Field Validation', () => {
  test('Should return an error if CompareFieldValidation returns false', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      password: 'any_password',
      confirmPassword: 'any_invalid',
    });
    expect(error).toEqual(new InvalidParamError('confirmPassword'));
  });

  test('Should return an error if 2 CompareFieldValidation returns false', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      password: 'any_password',
      confirmPassword: 'any_password',
    });
    expect(error).toBeFalsy();
  });

  test('Should throw EmailValidator throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
