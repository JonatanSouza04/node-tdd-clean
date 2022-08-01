import {
  SaveSurveyResultModel,
  SurveyResultModel,
} from '../models/survey-result';

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>;
}
