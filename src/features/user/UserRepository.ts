import { inject, injectable } from 'inversify';
import { CoreTypes } from '../../core/di/types';
import { ApiService } from '../../core/api/ApiService';
import { ApiResult } from '../../core/api/ApiResult';
import { User } from './UserModel';

@injectable()
export class UserRepository {
  constructor(@inject(CoreTypes.ApiService) private api: ApiService) { }
  async getUser(id: string): Promise<ApiResult<User>> { return this.api.get<User>(`/users/${id}`); }
}
