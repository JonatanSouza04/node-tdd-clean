import { AddSurveyModel } from '../models/survey';

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>;
}
