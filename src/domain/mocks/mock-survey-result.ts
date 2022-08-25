import {
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from '../models/survey-result';

export const mockSaveResultSurveyResult = (): SaveSurveyResultParamsModel => ({
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date(),
});

export const mockSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveResultSurveyResult(), {
    id: 'valid_id',
  });
