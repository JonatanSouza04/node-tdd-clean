import { InvalidParamError } from '@/presentation/erros';
import { forbidden, badRequest } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './load-survey-result-controller-protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest?.params?.surveyId) {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId,
      );

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
    }

    return badRequest(new InvalidParamError('surveyId'));
  }
}
