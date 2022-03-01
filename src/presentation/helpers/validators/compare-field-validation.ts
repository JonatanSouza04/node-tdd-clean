import { InvalidParamError } from '../../erros';
import { Validation } from './validation';

export class CompareFieldValidation implements Validation {
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
