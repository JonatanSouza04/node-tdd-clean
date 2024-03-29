import { AccountModel, AddAccountParamsModel } from '@/domain/models/account';
import { AuthenticationParamsModel } from '@/domain/models/authentication';
import { Request } from '@/presentation/controllers/signup/signup-controller';

export const mockAddAccountParams = (): AddAccountParamsModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), { id: 'any_id' });

export const mockAccountModelWithTokenParams = (): AddAccountParamsModel =>
  Object.assign({}, mockAddAccountParams(), { accessToken: 'any_token' });

export const mockAccountModelWithRoleParams = (): AddAccountParamsModel =>
  Object.assign({}, mockAddAccountParams(), {
    accessToken: 'any_token',
    role: 'admin',
  });

export const mockRequestAddAccount = (): Request => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirm: 'any_password',
});

export const mockAuthentication = (): AuthenticationParamsModel => ({
  email: 'any_email@email.com',
  password: 'any_password',
});
