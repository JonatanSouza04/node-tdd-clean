import { AddSurveyParamsModel } from '@/domain/models/survey';

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParamsModel) => Promise<void>;
}
