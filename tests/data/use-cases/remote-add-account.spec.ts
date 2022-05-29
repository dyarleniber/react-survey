import { EmailInUseError, UnexpectedError } from '@/domain/errors';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { RemoteAddAccount } from '@/data/use-cases';
import { mockAddAccountModel, mockAddAccountParams } from '@/tests/domain/mocks';
import { mockHttpClient } from '@/tests/data/mocks';
import { throwError } from '@/tests/helpers/test-helpers';

type SutTypes = {
  sut: RemoteAddAccount;
  httpClientStub: HttpClient<RemoteAddAccount.Model>;
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientStub = mockHttpClient<RemoteAddAccount.Model>(
    mockAddAccountModel(),
  );
  const sut = new RemoteAddAccount(url, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('RemoteAddAccount', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = 'any_url';
    const params = mockAddAccountParams();
    const { sut, httpClientStub } = makeSut(url);
    const requestSpy = jest.spyOn(httpClientStub, 'request');
    await sut.add(params);
    expect(requestSpy).toHaveBeenCalledWith({
      url,
      method: 'post',
      body: params,
    });
  });

  test('Should throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.badRequest }));
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.serverError }));
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.notFound }));
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw EmailInUseError if HttpClient returns 403', async () => {
    const { sut, httpClientStub } = makeSut();
    jest.spyOn(httpClientStub, 'request').mockImplementationOnce(async () => ({ statusCode: HttpStatusCode.forbidden }));
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test('Should return a valid model if HttpClient returns 200', async () => {
    const model = mockAddAccountModel();
    const { sut } = makeSut();
    const response = await sut.add(mockAddAccountParams());
    expect(response).toEqual(model);
  });
});
