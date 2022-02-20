import { LogErrorRepository } from '../../../../data/protocols/log-error-repository';

export class LogError implements LogErrorRepository {
  async log(stack: string): Promise<void> {
    await new Promise((resolve) => resolve(stack));
  }
}
