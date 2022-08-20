import { AuthenticationParamsModel } from '../../models/authentication';

export interface Authentication {
  auth: (authentication: AuthenticationParamsModel) => Promise<string>;
}
