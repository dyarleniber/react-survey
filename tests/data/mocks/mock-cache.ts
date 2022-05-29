import { GetStorage } from '@/data/protocols/cache';

export class GetStorageStub implements GetStorage {
  get(_key: string): any {
    return {};
  }
}
