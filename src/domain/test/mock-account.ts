import { AccountModel, AddAccountParamsModel } from '@/domain/models/account';
import { AuthenticationParamsModel } from '@/domain/models/authentication';
import { HttpRequest } from '@/presentation/protocols';

export const mockAddAccountParams = (): AddAccountParamsModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), { id: 'any_id' });

export const mockRequestAddAccount = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirm: 'any_password',
  },
});

export const mockAuthentication = (): AuthenticationParamsModel => ({
  email: 'any_email@email.com',
  password: 'any_password',
});
