import { RemoteLoadSurveyResult } from '@/data/use-cases';

export const mockRemoteSurveyResultModel = (): RemoteLoadSurveyResult.Model => ({
  question: 'any_question',
  date: (new Date()).toISOString(),
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
