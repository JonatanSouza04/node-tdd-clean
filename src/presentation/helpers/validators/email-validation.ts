import { InvalidParamError } from '../../erros';
import { EmailValidator } from '../../protocols';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  private readonly fieldname: string;
  private readonly emailValidator: EmailValidator;
  constructor(fieldname: string, emailValidator: EmailValidator) {
    this.fieldname = fieldname;
    this.emailValidator = emailValidator;
  }

  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldname]);
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldname);
    }

    return null as unknown as Error;
  }
}
