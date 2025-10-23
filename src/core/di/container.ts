import 'reflect-metadata';
import { Container } from 'inversify';
import { CoreTypes } from './types';
import { ApiService } from '../api/ApiService';
import { AxiosApiService } from '../api/AxiosApiService';
import { AuthService } from '../auth/AuthService';

const container = new Container();

// Register core services
container.bind<ApiService>(CoreTypes.ApiService)
  .toDynamicValue(() => new AxiosApiService(process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com'))
  .inSingletonScope();

container.bind(AuthService).toSelf().inSingletonScope();

// Import feature registrations (side effects)
import '../../features/user/di/container';
import '../../features/admin/di/container';
import '../../features/auth/di/container';
import '../../features/chat/di/container';

export { container, CoreTypes };
