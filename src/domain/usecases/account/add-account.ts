import { AccountModel, AddAccountModel } from '../../models/account';

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>;
}
