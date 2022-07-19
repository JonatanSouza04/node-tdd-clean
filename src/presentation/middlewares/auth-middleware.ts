import { ForbiddenError } from '../erros';
import { forbidden } from '../helpers/http/http-helper';
import { HttpRequest, HttpResponse, Middleware } from '../protocols';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new ForbiddenError(''));
    return await new Promise((resolve) => resolve(error));
  }
}
