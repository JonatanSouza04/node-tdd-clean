import { MissingParamError } from '../../erros';
import { RequiredFieldValidation } from './required-field-validation';
import { Validation } from './validation';

interface SutTypes {
  sut: Validation;
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field');

  return {
    sut,
  };
};

describe('RequiredField Validation', () => {
  test('Should return a MissingParamErro if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: 'any_field',
    });
    expect(error).toBeFalsy();
  });

  test('Should return an error if 2 CompareFieldValidation returns false', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      name: 'invalid',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
