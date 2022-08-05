import { InvalidParamError } from '@/presentation/erros';
import { forbidden, noContent } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const suryey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );

    if (!suryey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return noContent();
  }
}
