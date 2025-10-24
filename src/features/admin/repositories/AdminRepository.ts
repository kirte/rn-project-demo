import { inject, injectable } from 'inversify';
import { CoreTypes } from '../../../core/di/types';
import { ApiService } from '../../../core/api/ApiService';
import { ApiResult } from '../../../core/api/ApiResult';

@injectable()
export class AdminRepository {
  constructor(@inject(CoreTypes.ApiService) private api: ApiService) { }

  // Using /posts as a mock admin dashboard endpoint since /admin/dashboard doesn't exist
  async getDashboard(): Promise<ApiResult<any>> {
    return this.api.get('/posts?_limit=5'); // Get first 5 posts as mock dashboard data
  }
}
