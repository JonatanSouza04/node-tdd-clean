import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { DbAddAccount } from '../../data/usescases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';

import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { LogError } from '../../infra/db/mongodb/log-repository/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const logError = new LogError();

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );
  return new LogControllerDecorator(signUpController, logError);
};
