import {
  Controller,
  HttpResponse,
  LoadSurveys,
} from './load-survey-controller-protocols';
import { noContent, ok, serverError } from '../../../helpers/http/http-helper';

export type Request = {
  accountId: string;
};

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(request: Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
