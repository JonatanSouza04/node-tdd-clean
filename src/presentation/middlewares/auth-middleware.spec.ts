import { AuthMiddleware, Request } from './auth-middleware';
import { LoadAccountByToken } from './auth-middlewares-protocols';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { ForbiddenError } from '../erros';
import { mockThrowError } from '@/domain/mocks';
import { mockLoadAccountByToken } from '../mocks';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByToken: LoadAccountByToken;
};

const mockRequest = (): Request => ({
  accessToken: 'any_token',
});

const makeSut = (role?: string): SutTypes => {
  const loadAccountByToken = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByToken, role);

  return {
    sut,
    loadAccountByToken,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new ForbiddenError('')));
  });

  test('Should call LoadAccountByToken with correct a accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByToken } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByToken, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByToken } = makeSut();
    jest
      .spyOn(loadAccountByToken, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new ForbiddenError('')));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByToken } = makeSut();
    jest
      .spyOn(loadAccountByToken, 'load')
      .mockImplementationOnce(mockThrowError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
