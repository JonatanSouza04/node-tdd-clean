import {
  mockAccountModel,
  mockThrowError,
  mockAuthentication,
} from '@/domain/mocks';
import {
  mockEncrypter,
  mockHashComparer,
  mockUpdateAccessTokenRepository,
} from '@/data/mocks';
import { DbAuthentication } from './db-authentication';

import {
  AccountModel,
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRespositoryStub: UpdateAccessTokenRepository;
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(mockAccountModel()));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRespositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRespositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRespositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    sut.auth(mockAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  test('Should throw if LoadAccountByEmailRepository thorws', () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns empty', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null as any);

    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  test('Should call HasComparer correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(mockAuthentication());
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'any_password');
  });

  test('Should throw HasComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const gereratorSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(mockAuthentication());
    expect(gereratorSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRespositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRespositoryStub,
      'updateAccessToken',
    );
    await sut.auth(mockAuthentication());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRespositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRespositoryStub, 'updateAccessToken')
      .mockImplementationOnce(mockThrowError);
    const promise = sut.auth(mockAuthentication());
    expect(promise).rejects.toThrow();
  });
});
