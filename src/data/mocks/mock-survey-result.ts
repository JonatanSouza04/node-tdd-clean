import { mockSurveyResultModel } from '@/domain/mocks';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result/load-survey-result-repository';
import {
  SaveSurveyResultParamsModel,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '../usecases/save-survey-result/db-save-survey-result-protocols';

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParamsModel): Promise<void> {
        await Promise.resolve(mockSurveyResultModel());
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };

export const mockLoadSurveyResultRepository =
  (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId(
        surveyId: string,
        accountId: string,
      ): Promise<SurveyResultModel> {
        return await Promise.resolve(mockSurveyResultModel());
      }
    }
    return new LoadSurveyResultRepositoryStub();
  };
