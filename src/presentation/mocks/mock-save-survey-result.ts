import { mockSurveyResultModel, mockSurveysModels } from '@/domain/mocks';
import {
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultParamsModel,
  SurveyModel,
  SurveyResultModel,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => resolve(mockSurveysModels()[0]));
    }
  }

  return new LoadSurveyByIdStub();
};

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(mockSurveyResultModel()));
    }
  }

  return new SaveSurveyResultStub();
};
