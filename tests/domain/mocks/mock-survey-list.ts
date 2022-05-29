import { LoadSurveyList } from '@/domain/use-cases';

export const mockSurveyModel = (): LoadSurveyList.Model => ({
  id: 'any_id',
  question: 'any_question',
  didAnswer: false,
  date: new Date(),
});

export const mockSurveyListModel = (): LoadSurveyList.Model[] => ([
  mockSurveyModel(),
  mockSurveyModel(),
  mockSurveyModel(),
]);

export class LoadSurveyListStub implements LoadSurveyList {
  async loadAll(): Promise<LoadSurveyList.Model[]> {
    return mockSurveyListModel();
  }
}
