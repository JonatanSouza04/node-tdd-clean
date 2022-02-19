import {
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
} from './account-protocols';

import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountToBeInserted = Object.assign({}, accountData);
    const result = await accountCollection.insertOne(accountToBeInserted);
    return MongoHelper.map(accountData, result.insertedId.toString());
  }
}
