import { Authentication } from '@/domain/use-cases';
import { mockAccountModel } from '@/tests/domain/mocks/mock-account';

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAuthenticationModel = (): Authentication.Model => mockAccountModel();

export class AuthenticationStub implements Authentication {
  async auth(_params: Authentication.Params): Promise<Authentication.Model> {
    return mockAuthenticationModel();
  }
}
