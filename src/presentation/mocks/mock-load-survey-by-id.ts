import { mockSurveysModels } from '@/domain/mocks';
import {
  LoadSurveyById,
  SurveyModel,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => resolve(mockSurveysModels()[0]));
    }
  }

  return new LoadSurveyByIdStub();
};
