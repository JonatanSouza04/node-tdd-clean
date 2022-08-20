import { AddSurveyParamsModel } from '../../models/survey';

export interface AddSurvey {
  add: (data: AddSurveyParamsModel) => Promise<void>;
}
