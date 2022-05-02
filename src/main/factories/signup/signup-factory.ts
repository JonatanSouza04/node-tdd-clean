import env from '../../config/env';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-respository';

import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { makeSignUpValidation } from './signup-validation-factory';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { JWTAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.saltCrypt as number);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const logMongoRepository = new LogMongoRepository();

  const jwtAdapter = new JWTAdapter(env.jwtSecret);

  const accountMongoRespository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRespository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRespository,
  );

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
    dbAuthentication,
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
