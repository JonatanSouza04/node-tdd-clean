import {
  Authentication,
  LoadAccountByEmailRepository,
  AuthenticationParamsModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAcessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationParamsModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );

    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account.password,
      );

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAcessTokenRepository.updateAccessToken(
          account.id,
          accessToken,
        );
        return accessToken;
      }
    }

    return null as any;
  }
}
