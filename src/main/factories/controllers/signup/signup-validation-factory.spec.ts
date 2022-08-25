import { makeSignUpValidation } from './signup-validation-factory';
import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldValidation,
  EmailValidation,
} from '@/validation/validators';

import { Validation } from '@/presentation/protocols/validation';
import { mockEmailValidator } from '@/validation/mocks';

jest.mock('@/validation/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite if all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirm'));
    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
