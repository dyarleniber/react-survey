import { LoadSurveyResult } from '@/domain/use-cases';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { RemoteSurveyResultModel } from '@/data/models';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadSurveyResult.Model>,
  ) {}

  async load(): Promise<LoadSurveyResult.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
    });
    const remoteSurveyResult = httpResponse.body!;
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        return {
          ...remoteSurveyResult,
          date: new Date(remoteSurveyResult.date),
        };
      }
      case HttpStatusCode.forbidden: throw new AccessDeniedError();
      default: throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadSurveyResult {
  export type Model = RemoteSurveyResultModel
}
