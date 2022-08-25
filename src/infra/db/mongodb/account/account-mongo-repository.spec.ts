import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';
import {
  mockAccountModelWithRoleParams,
  mockAccountModelWithTokenParams,
  mockAddAccountParams,
} from '@/domain/mocks';

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
      const account = await sut.add(mockAddAccountParams());

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountColletion.insertOne(mockAddAccountParams());

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
    });

    test('Should return null on loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update then account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const res = await accountColletion.insertOne(mockAddAccountParams());

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
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountColletion.insertOne(mockAccountModelWithTokenParams());

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountColletion.insertOne(mockAccountModelWithRoleParams());

      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountColletion.insertOne(mockAccountModelWithTokenParams());
      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut();
      await accountColletion.insertOne(mockAccountModelWithRoleParams());

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
    });

    test('Should return null on loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');

      expect(account).toBeFalsy();
    });
  });
});
