import 'reflect-metadata';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AxiosApiService } from '../src/core/api/AxiosApiService';
import { UserRepository } from '../src/features/user/UserRepository';

describe('UserRepository', () => {
  it('fetches user', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, { id: 1, name: 'Bob' });
    const api = new AxiosApiService('https://jsonplaceholder.typicode.com');
    const repo = new UserRepository(api as any);
    const res = await repo.getUser('1');
    expect(res.type).toBe('Success');
    if (res.type === 'Success') expect(res.data.name).toBe('Bob');
    mock.restore();
  });
});
