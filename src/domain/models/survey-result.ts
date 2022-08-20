export type SurveyResultModel = {
  id: string;
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
};

export type SaveSurveyResultParamsModel = Omit<SurveyResultModel, 'id'>;
