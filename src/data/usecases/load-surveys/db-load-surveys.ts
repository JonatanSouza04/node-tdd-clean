import { LoadSurveys } from '@/domain/usecases/load-surveys';
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../add-survey/db-add-survey-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  }
}
