import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRespository: AddAccountRepository;
  constructor(hasher: Hasher, addAccountRespository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRespository = addAccountRespository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);

    return await this.addAccountRespository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    );
  }
}
