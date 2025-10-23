import { container } from '../../../core/di/container';
import { AuthTypes } from './types';
import { AuthRepository } from '../AuthRepository';

container.bind(AuthTypes.AuthRepository)
    .to(AuthRepository)
    .inSingletonScope();

export { AuthTypes };

