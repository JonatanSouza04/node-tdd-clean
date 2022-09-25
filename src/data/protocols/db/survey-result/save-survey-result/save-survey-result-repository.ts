import { SaveSurveyResultParamsModel } from '@/domain/models/survey-result';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParamsModel) => Promise<void>;
}
