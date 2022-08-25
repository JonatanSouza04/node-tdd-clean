import {
  AccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from './db-add-account-protocols';

import { DbAddAccount } from './db-add-account';
import {
  mockAccountModel,
  mockAddAccountParams,
  mockThrowError,
} from '@/domain/mocks';

import { mockAddAccountRepository, mockHasher } from '@/data/mocks';

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(null));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount UseCase', () => {
  test('Should call hasher with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'hash');
    await sut.add(mockAddAccountParams());
    expect(encryptSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if hasher throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'hash').mockImplementationOnce(mockThrowError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository wiht correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should throw if hashed password throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(mockThrowError);

    const promise = sut.add(mockAccountModel());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(mockAccountModel())),
      );

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });
});
