import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';
import { ApiService } from './ApiService';
import { ApiResult } from './ApiResult';

@injectable()
export class AxiosApiService implements ApiService {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({ baseURL: baseUrl, timeout: 10000, headers: {'Content-Type':'application/json'} });
  }

  async get<T>(path: string, params?: any): Promise<ApiResult<T>> {
    try { const res = await this.client.get<T>(path, { params }); return { type: 'Success', data: res.data, status: res.status }; } catch (err: any) { return this.handleError<T>(err); }
  }
  async post<T>(path: string, body: any): Promise<ApiResult<T>> {
    try { const res = await this.client.post<T>(path, body); return { type: 'Success', data: res.data, status: res.status }; } catch (err: any) { return this.handleError<T>(err); }
  }
  async put<T>(path: string, body: any): Promise<ApiResult<T>> {
    try { const res = await this.client.put<T>(path, body); return { type: 'Success', data: res.data, status: res.status }; } catch (err: any) { return this.handleError<T>(err); }
  }
  async delete<T>(path: string): Promise<ApiResult<T>> {
    try { const res = await this.client.delete<T>(path); return { type: 'Success', data: res.data, status: res.status }; } catch (err: any) { return this.handleError<T>(err); }
  }

  private handleError<T>(error: any): ApiResult<T> {
    if (error.response) return { type: 'Error', message: error.response.data?.message || 'Request failed', status: error.response.status, details: error.response.data };
    if (error.request) return { type: 'NetworkError', message: 'No network connection' };
    return { type: 'Error', message: error.message || 'Unexpected error' };
  }
}
