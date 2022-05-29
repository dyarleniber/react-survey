import axios, { AxiosError } from 'axios';
import { HttpStatusCode } from '@/data/protocols/http';
import { AxiosHttpClient } from '@/infra/http/axios-http-client';
import { mockHttpRequest } from '@/tests/data/mocks';
import { mockAxios, mockAxiosResponse } from '@/tests/infra/mocks';

jest.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient,
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();
  return {
    sut,
    mockedAxios,
  };
};

describe('AxiosHttpClient', () => {
  test('Should call axios request with correct values', async () => {
    const httpRequest = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();
    await sut.request(httpRequest);
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: httpRequest.url,
      method: httpRequest.method,
      data: httpRequest.body,
      headers: httpRequest.body,
    });
  });

  test('Should return a correct response on axios request success', async () => {
    const axiosResponse = mockAxiosResponse();
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockClear().mockResolvedValue(axiosResponse);
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    });
  });

  test('Should return a correct response when axios request throws an AxiosError', async () => {
    const axiosResponse = mockAxiosResponse();
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockClear().mockImplementation(async () => {
      const axiosError = new AxiosError();
      axiosError.response = axiosResponse;
      throw axiosError;
    });
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    });
  });

  test('Should return a server error status code when axios request throws an error other than AxiosError', async () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockClear().mockImplementation(async () => {
      throw new Error();
    });
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.serverError,
    });
  });
});
