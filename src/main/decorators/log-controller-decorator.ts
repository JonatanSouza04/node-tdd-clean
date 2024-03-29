import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRespository: LogErrorRepository,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRespository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
