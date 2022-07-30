import { InvalidParamError } from '@/presentation/erros';
import { EmailValidator } from '../protocols';
import { Validation } from '@/presentation/protocols/validation';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldname: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldname]);
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldname);
    }

    return null as unknown as Error;
  }
}
