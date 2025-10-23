import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ApiService } from '../../core/api/ApiService';
import { ApiResult } from '../../core/api/ApiResult';

@injectable()
export class AdminRepository { constructor(@inject(TYPES.ApiService) private api: ApiService) {}
  async getDashboard(): Promise<ApiResult<any>> { return this.api.get('/admin/dashboard'); }
}
