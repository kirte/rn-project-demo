import 'reflect-metadata';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AxiosApiService } from '../src/core/api/AxiosApiService';

describe('AxiosApiService', () => {
  it('returns success result on 200', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
    const svc = new AxiosApiService('');
    const res = await svc.get<any>('/users/1');
    expect(res.type).toBe('Success');
    if (res.type === 'Success') expect(res.data.name).toBe('Alice');
    mock.restore();
  });
});
