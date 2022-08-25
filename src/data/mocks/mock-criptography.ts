import { Hasher } from '@/data/protocols/cryptography/hasher';
import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { HashComparer } from '../protocols/cryptography/hash-comparer';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await Promise.resolve('hashed_password');
    }
  }
  return new HasherStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecryoterStub implements Decrypter {
    async decrypt(hash: string): Promise<string> {
      return await Promise.resolve('any_token');
    }
  }

  return new DecryoterStub();
};

export const mockEncrypter = (): Encrypter => {
  class HashComparerStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return await Promise.resolve('any_token');
    }
  }

  return new HashComparerStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }

  return new HashComparerStub();
};
