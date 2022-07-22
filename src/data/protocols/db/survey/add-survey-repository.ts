import { AddSurveyModel } from '../../../../domain/models/survey';

export interface AddSurveyRespository {
  add: (surveyData: AddSurveyModel) => Promise<void>;
}
