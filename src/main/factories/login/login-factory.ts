import env from '../../config/env';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { makeLoginValidation } from './login-validation-factory';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-respository';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JWTAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.saltCrypt as number);
  const jwtAdapter = new JWTAdapter(env.jwtSecret);

  const accountMongoRespository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRespository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRespository,
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
