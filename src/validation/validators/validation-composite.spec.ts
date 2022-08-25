import { ValidationComposite } from './validation-composite';
import { Validation } from '@/presentation/protocols/validation';
import { MissingParamError } from '@/presentation/erros';
import { mockValidations } from '../mocks';

type SutTypes = {
  sut: Validation;
};

const makeSut = (): SutTypes => {
  const sut = new ValidationComposite(mockValidations());

  return {
    sut,
  };
};

describe('ValidationComposite Validation', () => {
  test('Should return null if validation ok', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: 'any_field',
    });
    expect(error).toBeFalsy();
  });

  test('Should return Error if ValidationComposite returns errors', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      name: 'invalid',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
