import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { ForbiddenError } from '../erros';
import { AuthMiddleware } from './auth-middleware';
import {
  LoadAccountByToken,
  HttpRequest,
  AccountModel,
} from './auth-middlewares-protocols';

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByToken: LoadAccountByToken;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenStub();
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByToken = makeLoadAccountByToken();
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
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByToken } = makeSut();
    jest
      .spyOn(loadAccountByToken, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new ForbiddenError('')));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }));
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByToken } = makeSut();
    jest
      .spyOn(loadAccountByToken, 'load')
      .mockReturnValueOnce(
        new Promise((resolve) =>
          resolve(new Promise((resolve, reject) => reject(new Error()))),
        ),
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
