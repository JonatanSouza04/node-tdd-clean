import { mockSurveyModel, mockSurveysModels } from '@/domain/mocks';
import {
  AddSurveyParamsModel,
  AddSurveyRepository,
  SurveyModel,
} from '../usecases/survey/add-survey/db-add-survey-protocols';
import { LoadSurveyByIdRepository } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { LoadSurveysRepository } from '../usecases/survey/load-surveys/db-load-surveys-protocols';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParamsModel): Promise<void> {
      return await Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveysModels());
    }
  }

  return new LoadSurveysRepositoryStub();
};
