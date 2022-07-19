import { HttpRequest } from '../protocols';
import { forbidden } from '../helpers/http/http-helper';
import { ForbiddenError } from '../erros';
import { AuthMiddleware } from './auth-middleware';

const makeAuthMiddleware = (): AuthMiddleware => {
  return new AuthMiddleware();
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = makeAuthMiddleware();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new ForbiddenError('')));
  });
});
