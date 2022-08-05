import { InvalidParamError } from '@/presentation/erros';
import { badRequest, noContent } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const suryeyResult = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );

    if (!suryeyResult) {
      return badRequest(new InvalidParamError('Survey Invalid'));
    }

    return noContent();
  }
}
