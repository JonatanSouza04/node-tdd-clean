import { makeLoginValidation } from './login-validation-factory';
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from '@/validation/validators';

import { Validation } from '@/presentation/protocols/validation';
import { mockEmailValidator } from '@/validation/mocks';

jest.mock('@/validation/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite if all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
