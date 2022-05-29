import MockDate from 'mockdate';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { RemoteLoadSurveyList } from '@/data/use-cases';
import { mockSurveyListModel } from '@/tests/domain/mocks';
import { mockHttpClient, mockRemoteSurveyListModel } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helpers';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpClientStub: HttpClient<RemoteLoadSurveyList.Model[]>;
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientStub = mockHttpClient<RemoteLoadSurveyList.Model[]>(
    mockRemoteSurveyListModel(),
  );
  const sut = new RemoteLoadSurveyList(url, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('RemoteLoadSurveyList', () => {
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
    await sut.loadAll();
    expect(requestSpy).toHaveBeenCalledWith({
      url,
      method: 'get',
    });
  });

  test('Should throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(throwError);
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow();
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.badRequest }));
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.serverError }));
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.notFound }));
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.forbidden }));
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should return an empty array if HttpClient returns 204', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.noContent }));
    const response = await sut.loadAll();
    await expect(response).toEqual([]);
  });

  test('Should return a valid model array if HttpClient returns 200', async () => {
    const model = mockSurveyListModel();
    const { sut } = makeSut();
    const response = await sut.loadAll();
    expect(response).toEqual(model);
  });
});
