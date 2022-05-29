import env from '../../../config/env';
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-respository';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JWTAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { Authentication } from '../../../../domain/usecases/authentication';

export const makeDbAuthentication = (): Authentication => {
  const bcryptAdapter = new BcryptAdapter(env.saltCrypt as number);
  const jwtAdapter = new JWTAdapter(env.jwtSecret);

  const accountMongoRespository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRespository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRespository,
  );
};
