import {
  AddSurveyRepository,
  AddSurvey,
  AddSurveyParamsModel,
} from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(data: AddSurveyParamsModel): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
