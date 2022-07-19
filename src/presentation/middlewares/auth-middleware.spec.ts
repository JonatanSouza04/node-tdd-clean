import { HttpRequest } from '../protocols';
import { forbidden } from '../helpers/http/http-helper';
import { ForbiddenError } from '../erros';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccountModel } from '../../domain/models/account';

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

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByToken = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByToken);

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
    const { sut, loadAccountByToken } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token',
      },
    };
    const loadSpy = jest.spyOn(loadAccountByToken, 'load');
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});
