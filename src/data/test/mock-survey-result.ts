import { mockSurveyResultModel } from '@/domain/test';
import {
  SaveSurveyResultParamsModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '../usecases/save-survey-result/db-save-survey-result-protocols';

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(
        data: SaveSurveyResultParamsModel,
      ): Promise<SurveyResultModel> {
        return await new Promise((resolve) => resolve(mockSurveyResultModel()));
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };
