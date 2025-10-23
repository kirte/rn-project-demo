import { inject, injectable } from 'inversify';
import { CoreTypes } from '../../core/di/types';
import { ApiService } from '../../core/api/ApiService';
import { ApiResult } from '../../core/api/ApiResult';

@injectable()
export class AdminRepository {
    constructor(@inject(CoreTypes.ApiService) private api: ApiService) { }
  async getDashboard(): Promise<ApiResult<any>> { return this.api.get('/admin/dashboard'); }
}
