import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  HttpClient, HttpRequest, HttpResponse, HttpStatusCode,
} from '@/data/protocols/http';

export class AxiosHttpClient<R = any> implements HttpClient<R> {
  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    let axiosResponse: AxiosResponse;
    try {
      const {
        url, method, body, headers,
      } = data;
      axiosResponse = await axios.request({
        url,
        method,
        data: body,
        headers,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        axiosResponse = error.response;
      } else {
        return {
          statusCode: HttpStatusCode.serverError,
        };
      }
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
