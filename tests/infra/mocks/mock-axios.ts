import axios, { AxiosResponse, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';
import { HttpStatusCode } from '@/data/protocols/http';

export const mockAxiosResponse = (
  data: any = undefined,
  status: HttpStatusCode = HttpStatusCode.ok,
  statusText: string = 'Ok',
  headers: AxiosResponseHeaders = {},
  config: AxiosRequestConfig = {},
): AxiosResponse => ({
  data,
  status,
  statusText,
  headers,
  config,
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.request.mockClear().mockResolvedValue(mockAxiosResponse());
  return mockedAxios;
};
