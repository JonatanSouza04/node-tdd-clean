import { InvalidParamError } from '@/presentation/erros';
import {
  forbidden,
  badRequest,
  serverError,
  ok,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult,
} from './load-survey-result-controller-protocols';

export type Request = {
  surveyId: string;
  accountId: string;
};

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request;

      if (surveyId && accountId) {
        const survey = await this.loadSurveyById.loadById(surveyId);

        if (!survey) {
          return forbidden(new InvalidParamError('surveyId'));
        }

        const surveyResult = await this.loadSurveyResult.load(
          surveyId,
          accountId,
        );
        return ok(surveyResult);
      }

      return badRequest(new InvalidParamError('surveyId'));
    } catch (error) {
      return serverError(error);
    }
  }
}
