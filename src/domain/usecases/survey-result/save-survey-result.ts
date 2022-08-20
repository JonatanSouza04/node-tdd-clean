import {
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from '../../models/survey-result';

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParamsModel) => Promise<SurveyResultModel>;
}
