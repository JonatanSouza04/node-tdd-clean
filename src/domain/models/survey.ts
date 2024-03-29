export type SurveyModel = {
  id: string;
  question: string;
  answers: SurveyAnswersModel[];
  date?: Date;
};

export type SurveyAnswersModel = {
  image?: string;
  answer: string;
};

export type AddSurveyParamsModel = Omit<SurveyModel, 'id'>;
