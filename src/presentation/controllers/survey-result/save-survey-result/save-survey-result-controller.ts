import { InvalidParamError } from '@/presentation/erros';
import {
  forbidden,
  noContent,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const suryey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId,
      );

      if (!suryey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
