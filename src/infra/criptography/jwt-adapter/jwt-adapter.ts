import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/cryptography/encrypter';

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  async encrypt(value: string): Promise<string> {
    await jwt.sign({ id: value }, this.secret);
    return await new Promise((resolve) => resolve(''));
  }
}
