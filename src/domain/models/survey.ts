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

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswersModel[];
  date?: Date;
};
