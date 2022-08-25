import { mockSurveysModels } from '@/domain/mocks';
import {
  LoadSurveys,
  SurveyModel,
} from '@/presentation/controllers/survey/load-surveys/load-survey-controller-protocols';

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => resolve(mockSurveysModels()));
    }
  }

  return new LoadSurveysStub();
};
