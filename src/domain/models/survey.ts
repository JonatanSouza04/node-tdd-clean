export interface SurveyModel {
  id: string;
  question: string;
  answers: SurveyAnswersModel[];
  date?: Date;
}

export interface SurveyAnswersModel {
  image?: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswersModel[];
  date?: Date;
}
