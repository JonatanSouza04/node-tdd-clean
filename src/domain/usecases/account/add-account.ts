import { AccountModel, AddAccounParamstModel } from '../../models/account';

export interface AddAccount {
  add: (account: AddAccounParamstModel) => Promise<AccountModel>;
}
