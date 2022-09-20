import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
} from '../survey/load-survey-result/db-load-survey-result-protocols';
import {
  SaveSurveyResultRepository,
  SaveSurveyResultParamsModel,
  SaveSurveyResult,
  SurveyResultModel,
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      data.surveyId,
      data.accountId,
    );
    return surveyResult;
  }
}
