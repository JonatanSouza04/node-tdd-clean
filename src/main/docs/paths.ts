import {
  loginPath,
  signUpnPath,
  surveyResultPath,
  surveysPath,
} from '@/main/docs/paths/';

export default {
  '/login': loginPath,
  '/signup': signUpnPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
