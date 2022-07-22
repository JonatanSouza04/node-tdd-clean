import {
  AddSurveyRespository,
  AddSurvey,
  AddSurveyModel,
} from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRespository) {}

  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
