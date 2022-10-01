import { ForbiddenError } from '../../erros';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '../../helpers/http/http-helper';
import {
  Controller,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication,
} from './signup-controller-protocols';

export type Request = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      if (!account) {
        return forbidden(new ForbiddenError('Email is already used'));
      }
      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
