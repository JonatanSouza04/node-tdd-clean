import { AccountModel, AddAccountParamsModel } from '../../models/account';

export interface AddAccount {
  add: (account: AddAccountParamsModel) => Promise<AccountModel>;
}
