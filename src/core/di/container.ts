// Note: reflect-metadata is imported in index.js (app entry point)
// to ensure it's loaded before InversifyJS is used anywhere
import { Container } from 'inversify';
import { CoreTypes } from './types';
import { ApiService } from '../api/ApiService';
import { AxiosApiService } from '../api/AxiosApiService';
import { AuthService } from '../auth/AuthService';

const container = new Container();

// Export container FIRST to allow feature modules to import it
export { container, CoreTypes };

// Register core services only
container.bind<ApiService>(CoreTypes.ApiService)
  .toDynamicValue(() => new AxiosApiService(process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com'))
  .inSingletonScope();

container.bind<AuthService>(CoreTypes.AuthService).to(AuthService).inSingletonScope();

// Note: Feature containers are NOT imported here to avoid startup overhead
// Each feature will register its dependencies lazily when imported via its index.ts
