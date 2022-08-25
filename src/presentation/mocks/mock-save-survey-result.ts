import { mockSurveyResultModel } from '@/domain/mocks';
import {
  SaveSurveyResult,
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultStub();
};
