import { MissingParamError } from '../../presentation/erros';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};

describe('RequiredField Validation', () => {
  test('Should return a MissingParamErro if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_field',
    });
    expect(error).toBeFalsy();
  });

  test('Should return an error if 2 CompareFieldValidation returns false', () => {
    const sut = makeSut();
    const error = sut.validate({
      name: 'invalid',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
