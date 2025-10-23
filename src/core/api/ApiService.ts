import { ApiResult } from './ApiResult';
export interface ApiService {
  get<T>(path: string, params?: any): Promise<ApiResult<T>>;
  post<T>(path: string, body: any): Promise<ApiResult<T>>;
  put<T>(path: string, body: any): Promise<ApiResult<T>>;
  delete<T>(path: string): Promise<ApiResult<T>>;
}
