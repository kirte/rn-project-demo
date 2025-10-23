import { container } from '../../../core/di/container';
import { UserTypes } from './types';
import { UserRepository } from '../UserRepository';

container.bind(UserTypes.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

export { UserTypes };

