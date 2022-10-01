import { InvalidParamError } from '@/presentation/erros';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
} from './save-survey-result-controller-protocols';

export type Request = {
  surveyId: string;
  accountId: string;
  answer: string;
};

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request;
      const suryey = await this.loadSurveyById.loadById(surveyId);

      if (suryey) {
        const answers = suryey.answers.map((a) => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        date: new Date(),
        answer,
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
