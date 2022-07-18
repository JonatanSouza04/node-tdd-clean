import { AddSurvey, AddSurveyModel, SurveyModel } from './survey-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurvey {
  async add(surverData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyToBeInserted = Object.assign({}, surverData);
    await surveyCollection.insertOne(surveyToBeInserted);
  }
}
