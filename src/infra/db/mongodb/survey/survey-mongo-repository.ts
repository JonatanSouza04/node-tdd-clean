import {
  SurveyModel,
  AddSurveyParamsModel,
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
} from './survey-mongo-repository-protocols';

import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surverData: AddSurveyParamsModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveyToBeInserted = Object.assign({}, surverData);
    await surveyCollection.insertOne(surveyToBeInserted);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModel[] = (await surveyCollection
      .find()
      .toArray()) as unknown as SurveyModel[];
    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey: SurveyModel = (await surveyCollection.findOne({
      _id: MongoHelper.objectID(id),
    })) as unknown as SurveyModel;
    return survey && MongoHelper.map(survey);
  }
}
