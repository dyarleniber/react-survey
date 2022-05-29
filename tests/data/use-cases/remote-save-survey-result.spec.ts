import MockDate from 'mockdate';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { RemoteSaveSurveyResult } from '@/data/use-cases';
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks';
import { mockHttpClient, mockRemoteSurveyResultModel } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helpers';

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientStub: HttpClient<RemoteSaveSurveyResult.Model>;
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientStub = mockHttpClient<RemoteSaveSurveyResult.Model>(
    mockRemoteSurveyResultModel(),
  );
  const sut = new RemoteSaveSurveyResult(url, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('RemoteSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call HttpClient with correct values', async () => {
    const url = 'any_url';
    const params = mockSaveSurveyResultParams();
    const { sut, httpClientStub } = makeSut(url);
    const requestSpy = jest.spyOn(httpClientStub, 'request');
    await sut.save(params);
    expect(requestSpy).toHaveBeenCalledWith({
      url,
      method: 'put',
      body: params,
    });
  });

  test('Should throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(throwError);
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.badRequest }));
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.serverError }));
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.notFound }));
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.forbidden }));
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should return a valid model if HttpClient returns 200', async () => {
    const model = mockSurveyResultModel();
    const { sut } = makeSut();
    const response = await sut.save(mockSaveSurveyResultParams());
    expect(response).toEqual(model);
  });
});
