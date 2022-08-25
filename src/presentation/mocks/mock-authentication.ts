import {
  Authentication,
  AuthenticationParamsModel,
} from '../controllers/login/login-controller-protocols';

export const mockAuthentication = (): any => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParamsModel): Promise<string> {
      return await Promise.resolve('any_token');
    }
  }

  return new AuthenticationStub();
};
