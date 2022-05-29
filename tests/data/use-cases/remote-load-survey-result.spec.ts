import MockDate from 'mockdate';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { RemoteLoadSurveyResult } from '@/data/use-cases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';
import { mockHttpClient, mockRemoteSurveyResultModel } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helpers';

type SutTypes = {
  sut: RemoteLoadSurveyResult;
  httpClientStub: HttpClient<RemoteLoadSurveyResult.Model>;
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientStub = mockHttpClient<RemoteLoadSurveyResult.Model>(
    mockRemoteSurveyResultModel(),
  );
  const sut = new RemoteLoadSurveyResult(url, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('RemoteLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call HttpClient with correct values', async () => {
    const url = 'any_url';
    const { sut, httpClientStub } = makeSut(url);
    const requestSpy = jest.spyOn(httpClientStub, 'request');
    await sut.load();
    expect(requestSpy).toHaveBeenCalledWith({
      url,
      method: 'get',
    });
  });

  test('Should throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(throwError);
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.badRequest }));
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.serverError }));
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.notFound }));
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.forbidden }));
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should return a valid model if HttpClient returns 200', async () => {
    const model = mockSurveyResultModel();
    const { sut } = makeSut();
    const response = await sut.load();
    expect(response).toEqual(model);
  });
});
