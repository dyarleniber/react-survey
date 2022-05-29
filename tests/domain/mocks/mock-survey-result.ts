import { LoadSurveyResult, SaveSurveyResult } from '@/domain/use-cases';

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  answer: 'any_answer',
});

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
    {
      answer: 'other_answer',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
});

export class LoadSurveyResultStub implements LoadSurveyResult {
  async load(): Promise<LoadSurveyResult.Model> {
    return mockSurveyResultModel();
  }
}

export class SaveSurveyResultStub implements SaveSurveyResult {
  async save(_params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model> {
    return mockSurveyResultModel();
  }
}
