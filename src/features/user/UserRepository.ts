import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ApiService } from '../../core/api/ApiService';
import { ApiResult } from '../../core/api/ApiResult';
import { User } from './UserModel';

@injectable()
export class UserRepository {
  constructor(@inject(TYPES.ApiService) private api: ApiService) {}
  async getUser(id: string): Promise<ApiResult<User>> { return this.api.get<User>(`/users/${id}`); }
}
