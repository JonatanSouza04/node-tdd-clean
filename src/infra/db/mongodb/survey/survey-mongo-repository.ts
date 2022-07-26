import {
  SurveyModel,
  AddSurveyModel,
  AddSurveyRepository,
  LoadSurveysRepository,
} from './survey-protocols';

import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(surverData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyToBeInserted = Object.assign({}, surverData);
    await surveyCollection.insertOne(surveyToBeInserted);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModel[] = (await surveyCollection
      .find()
      .toArray()) as unknown as SurveyModel[];
    return surveys;
  }
}
