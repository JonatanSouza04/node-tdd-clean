import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';

import { AccountModel } from '../../../domain/models/account';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    const result: AccountModel = {
      name: 'valid_name',
      email: 'valid_email',
      id: '',
      password: 'valid_password',
    };
    return await new Promise((resolve) => resolve(result));
  }
}
