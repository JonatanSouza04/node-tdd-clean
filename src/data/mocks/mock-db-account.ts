import {
  AccountModel,
  AddAccountParamsModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from '@/data/usecases/account/add-account/db-add-account-protocols';
import { mockAccountModel } from '@/domain/mocks';
import { LoadAccountByTokenRepository } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token-protocols';
import { UpdateAccessTokenRepository } from '@/data/usecases/authentication/db-authentication-protocols';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParamsModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(mockAccountModel()));
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(
        token: string,
        role?: string,
      ): Promise<AccountModel | null> {
        return await new Promise((resolve) => resolve(mockAccountModel()));
      }
    }

    return new LoadAccountByTokenRepositoryStub();
  };

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        return await new Promise((resolve) => resolve(mockAccountModel()));
      }
    }

    return new LoadAccountByEmailRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(id: string, token: string): Promise<void> {
        return await new Promise((resolve) => resolve());
      }
    }

    return new UpdateAccessTokenRepositoryStub();
  };
