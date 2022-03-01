import { InvalidParamError, MissingParamError } from '../../erros';
import { Validation } from './validation';

const makeCompareFieldValidation = (
  password: string,
  confirmPassword: string,
): Validation => {
  class CompareFieldValidationStub implements Validation {
    private readonly fieldname: string;
    private readonly fieldToCompareName: string;
    constructor(fieldname: string, fieldToCompareName: string) {
      this.fieldname = fieldname;
      this.fieldToCompareName = fieldToCompareName;
    }

    validate(input: any): Error {
      if (input[this.fieldname] !== input[this.fieldToCompareName]) {
        return new InvalidParamError(this.fieldToCompareName);
      }

      return null as unknown as Error;
    }
  }

  return new CompareFieldValidationStub(password, confirmPassword);
};

interface SutTypes {
  sut: Validation;
  fieldStub: any;
}

const makeSut = (): SutTypes => {
  const fieldStub = {
    password: 'password',
    confirmPassword: 'confirmPassword',
  };

  const sut = makeCompareFieldValidation(
    fieldStub.password,
    fieldStub.confirmPassword,
  );
  return {
    sut,
    fieldStub,
  };
};

describe('Compare Field Validation', () => {
  test('Should return an error if CompareFieldValidation returns false', () => {
    const { sut, fieldStub } = makeSut();
    const error = sut.validate({
      password: 'any_password',
      confirmPassword: 'any_invalid',
    });
    expect(error).toEqual(new InvalidParamError(fieldStub.confirmPassword));
  });

  test('Should return an error if 2 CompareFieldValidation returns false', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      password: 'any_password',
      confirmPassword: 'any_password',
    });
    expect(error).toEqual(null);
  });

  test('Should throw EmailValidator throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
