import { AccountModel, AddAccountParamsModel } from '@/domain/models/account';

export interface AddAccountRepository {
  add: (account: AddAccountParamsModel) => Promise<AccountModel>;
}
