import { DbLoadAccountByToken } from './db-load-account-by-token';

import {
  AccountModel,
  LoadAccountByTokenRepository,
  Decrypter,
} from './db-load-account-by-token-protocols';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeDecrypter = (): Decrypter => {
  class DecryoterStub implements Decrypter {
    async decrypt(hash: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'));
    }
  }

  return new DecryoterStub();
};

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(
      token: string,
      role?: string,
    ): Promise<AccountModel | null> {
      return await new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut();
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decrypterSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });
});
