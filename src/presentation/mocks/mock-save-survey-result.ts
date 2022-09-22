import { mockSurveyResultModel } from '@/domain/mocks';
import {
  SaveSurveyResult,
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';
import { LoadSurveyResult } from '../controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(
      surveyId: string,
      accountId: string,
    ): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }

  return new LoadSurveyResultStub();
};
