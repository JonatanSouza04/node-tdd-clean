import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

let accountColletion: Collection;

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.deleteMany({});
  });

  describe('add()', () => {
    test('Should return an account on add sucess', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@imail.com',
        password: 'any_password',
      });

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@imail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@imail.com',
        password: 'any_password',
      });

      const account = await sut.loadByEmail('any_email@imail.com');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@imail.com');
    });

    test('Should return null on loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@imail.com');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update then account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const res = await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@imail.com',
        password: 'any_password',
      });

      const id = res.insertedId.toString();

      await sut.updateAccessToken(id, 'any_token');
      const account = await accountColletion.findOne({
        _id: MongoHelper.objectID(id),
      });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success', async () => {
      const sut = makeSut();
      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@imail.com',
        password: 'any_password',
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@imail.com');
    });
  });
});
