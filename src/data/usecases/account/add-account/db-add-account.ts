import {
  AddAccount,
  AddAccountParamsModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountParamsModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );

    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);

      return await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword }),
      );
    }

    return null;
  }
}
