import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { ApiService } from '../api/ApiService';
import { AxiosApiService } from '../api/AxiosApiService';
import { UserRepository } from '../../features/user/UserRepository';
import { AuthService } from '../auth/AuthService';
import { AdminRepository } from '../../features/admin/AdminRepository';
import { ChatSessionService } from '../../features/chat/ChatSessionService';

const container = new Container();

container.bind<ApiService>(TYPES.ApiService)
  .toDynamicValue(() => new AxiosApiService(process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com'))
  .inSingletonScope();

container.bind(UserRepository).to(UserRepository).inSingletonScope();
container.bind(AuthService).to(AuthService).inSingletonScope();
container.bind(AdminRepository).to(AdminRepository).inSingletonScope();
container.bind<any>(TYPES.ChatSessionService).toDynamicValue(() => new ChatSessionService()).inTransientScope();

export { container };
