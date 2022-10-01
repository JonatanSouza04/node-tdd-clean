import {
  badRequest,
  serverError,
  ok,
  unAuthorized,
} from '../../helpers/http/http-helper';

import {
  Controller,
  HttpResponse,
  Authentication,
  Validation,
} from './login-controller-protocols';

export type Request = {
  email: string;
  password: string;
};

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;

      const accessToken = await this.authentication.auth({ email, password });

      if (!accessToken) {
        return unAuthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
