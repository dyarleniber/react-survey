import {
  HttpRequest, HttpResponse, HttpStatusCode, HttpClient,
} from '@/data/protocols/http';

export const mockHttpRequest = (): HttpRequest => ({
  url: 'any_url',
  method: 'post',
  body: {},
  headers: {},
});

export const mockHttpClient = <R = any>(body?: R): HttpClient<R> => {
  class HttpClientStub implements HttpClient<R> {
    async request(_data: HttpRequest): Promise<HttpResponse<R>> {
      return {
        statusCode: HttpStatusCode.ok,
        body,
      };
    }
  }
  return new HttpClientStub();
};
