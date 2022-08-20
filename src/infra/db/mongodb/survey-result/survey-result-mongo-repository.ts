import { SaveSurveyResultRepository } from './survey-result-mongo-repository-protocols';
import {
  SaveSurveyResultParamsModel,
  SurveyResultModel,
} from '@/domain/models/survey-result';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParamsModel): Promise<SurveyResultModel> {
    const surveyResultColletion = await MongoHelper.getCollection(
      'surveyResults',
    );
    const result = await surveyResultColletion.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );

    return MongoHelper.map(data, result.value._id.toString());
  }
}
