import bcrypt from 'bcrypt';
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer';
import { Hasher } from '../../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare(value: string | Buffer, encrypted: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, encrypted);
    return isValid;
  }
}