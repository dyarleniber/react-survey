import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { RemoteAuthentication } from '@/data/use-cases';
import { mockAuthenticationModel, mockAuthenticationParams } from '@/tests/domain/mocks';
import { mockHttpClient } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helpers';

type SutTypes = {
  sut: RemoteAuthentication;
  httpClientStub: HttpClient<RemoteAuthentication.Model>;
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientStub = mockHttpClient<RemoteAuthentication.Model>(
    mockAuthenticationModel(),
  );
  const sut = new RemoteAuthentication(url, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = 'any_url';
    const params = mockAuthenticationParams();
    const { sut, httpClientStub } = makeSut(url);
    const requestSpy = jest.spyOn(httpClientStub, 'request');
    await sut.auth(params);
    expect(requestSpy).toHaveBeenCalledWith({
      url,
      method: 'post',
      body: params,
    });
  });

  test('Should throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.badRequest }));
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.serverError }));
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.notFound }));
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw InvalidCredentialsError if HttpClient returns 401', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.unauthorized }));
    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('Should return a valid model if HttpClient returns 200', async () => {
    const model = mockAuthenticationModel();
    const { sut } = makeSut();
    const response = await sut.auth(mockAuthenticationParams());
    expect(response).toEqual(model);
  });
});
