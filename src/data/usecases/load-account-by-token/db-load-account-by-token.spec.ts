import { Decrypter } from '../../../data/protocols/cryptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeDecrypter = (): Decrypter => {
  class DecryoterStub implements Decrypter {
    async decrypt(hash: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_value'));
    }
  }

  return new DecryoterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);

  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut();
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decrypterSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });
});
