import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ApiService } from '../../core/api/ApiService';
import { ApiResult } from '../../core/api/ApiResult';

@injectable()
export class AuthRepository { constructor(@inject(TYPES.ApiService) private api: ApiService) {}
  async login(username: string, password: string): Promise<ApiResult<any>> { return this.api.post('/auth/login', { username, password }); }
}
