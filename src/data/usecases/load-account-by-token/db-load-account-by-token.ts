import {
  AccountModel,
  LoadAccountByTokenRepository,
  LoadAccountByToken,
  Decrypter,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(token, role);
    }
    return null;
  }
}