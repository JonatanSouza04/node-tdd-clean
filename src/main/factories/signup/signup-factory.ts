import env from '../../config/env';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-respository';

import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.saltCrypt as number);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const logMongoRepository = new LogMongoRepository();

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
