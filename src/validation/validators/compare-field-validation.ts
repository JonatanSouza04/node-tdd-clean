import { InvalidParamError } from '@/presentation/erros';
import { Validation } from '@/presentation/protocols/validation';

export class CompareFieldValidation implements Validation {
  constructor(
    private readonly fieldname: string,
    private readonly fieldToCompareName: string,
  ) {}

  validate(input: any): Error {
    if (input[this.fieldname] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }

    return null as unknown as Error;
  }
}
