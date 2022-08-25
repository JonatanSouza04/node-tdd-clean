import { mockAccountModel } from '@/domain/mocks';
import {
  AccountModel,
  AddAccount,
  AddAccountParamsModel,
} from '../controllers/signup/signup-controller-protocols';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParamsModel): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};
