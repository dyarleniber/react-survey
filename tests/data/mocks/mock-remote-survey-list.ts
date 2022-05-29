import { RemoteLoadSurveyList } from '@/data/use-cases';

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.Model => ({
  id: 'any_id',
  question: 'any_question',
  didAnswer: false,
  date: (new Date()).toISOString(),
});

export const mockRemoteSurveyListModel = (): RemoteLoadSurveyList.Model[] => ([
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
]);
