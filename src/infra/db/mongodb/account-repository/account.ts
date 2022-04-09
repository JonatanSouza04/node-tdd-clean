import {
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
} from './account-protocols';

import { MongoHelper } from '../helpers/mongo-helper';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountToBeInserted = Object.assign({}, accountData);
    const result = await accountCollection.insertOne(accountToBeInserted);
    return MongoHelper.map(accountData, result.insertedId.toString());
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account?._id && MongoHelper.map(account, account._id.toString());
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: MongoHelper.objectID(id) },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}
