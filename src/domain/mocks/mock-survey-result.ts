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

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      count: 1,
      percent: 50,
    },
    {
      answer: 'other_answer',
      count: 1,
      percent: 80,
    },
  ],
  date: new Date(),
});

export const mockSurveyResultEmptyModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
      count: 0,
      percent: 0,
    },
    {
      answer: 'other_answer',
      count: 0,
      percent: 0,
    },
  ],
  date: new Date(),
});
