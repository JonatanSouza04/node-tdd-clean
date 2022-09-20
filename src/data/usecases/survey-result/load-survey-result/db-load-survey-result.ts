import {
  LoadSurveyResultRepository,
  LoadSurveyResult,
  SurveyResultModel,
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const result = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId,
    );
    return result;
  }
}
