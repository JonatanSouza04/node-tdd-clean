import {
  AddSurvey,
  AddSurveyParamsModel,
} from '../controllers/survey/add-survey/add-survey-controller-protocols';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParamsModel): Promise<void> {
      return await Promise.resolve();
    }
  }

  return new AddSurveyStub();
};
