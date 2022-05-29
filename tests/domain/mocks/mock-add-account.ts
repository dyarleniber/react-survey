import { AddAccount } from '@/domain/use-cases';
import { mockAccountModel } from '@/tests/domain/mocks/mock-account';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
});

export const mockAddAccountModel = (): AddAccount.Model => mockAccountModel();

export class AddAccountStub implements AddAccount {
  async add(_params: AddAccount.Params): Promise<AddAccount.Model> {
    return mockAddAccountModel();
  }
}
