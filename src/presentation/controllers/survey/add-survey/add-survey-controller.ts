import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper';
import {
  Controller,
  HttpResponse,
  Validation,
  AddSurvey,
  SurveyAnswersModel,
} from './add-survey-controller-protocols';

export type Request = {
  question: string;
  answers: SurveyAnswersModel[];
};

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(request: Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;

      await this.addSurvey.add({
        question,
        answers,
        date: new Date(),
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
