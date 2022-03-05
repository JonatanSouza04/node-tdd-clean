import { makeSignUpValidation } from './signup-validation';
import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldValidation,
  EmailValidation,
} from '../../../presentation/helpers/validators';

import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite if all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirm'));
    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
