import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

export interface AddSurveyRespository {
  add: (surveyData: AddSurveyModel) => Promise<void>;
}
