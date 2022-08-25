import { mockAccountModel } from '@/domain/mocks';
import {
  AccountModel,
  LoadAccountByToken,
} from '@/presentation/middlewares/auth-middlewares-protocols';

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(mockAccountModel()));
    }
  }

  return new LoadAccountByTokenStub();
};
