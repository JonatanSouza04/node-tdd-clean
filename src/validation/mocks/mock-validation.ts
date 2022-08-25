import { Validation } from '@/presentation/protocols';
import { RequiredFieldValidation } from '../validators';

export const mockValidations = (): Validation[] => {
  const validations: Validation[] = [];

  validations.push(new RequiredFieldValidation('field'));
  return validations;
};

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as Error;
    }
  }

  return new ValidationStub();
};
