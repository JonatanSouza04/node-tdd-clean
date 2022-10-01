import { ForbiddenError } from '../erros';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import {
  HttpResponse,
  Middleware,
  LoadAccountByToken,
} from './auth-middlewares-protocols';

export type Request = {
  accessToken?: string;
};

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role,
        );
        if (account) {
          return ok({ accountId: account.id });
        }
      }
      return forbidden(new ForbiddenError(''));
    } catch (error) {
      return serverError(error);
    }
  }
}
