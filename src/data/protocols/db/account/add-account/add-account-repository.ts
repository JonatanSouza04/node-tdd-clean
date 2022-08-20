import { AccountModel, AddAccounParamstModel } from '@/domain/models/account';

export interface AddAccountRepository {
  add: (account: AddAccounParamstModel) => Promise<AccountModel>;
}
