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
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const suryey = await this.loadSurveyById.loadById(surveyId);

      if (suryey) {
        const answers = suryey.answers.map((a) => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
