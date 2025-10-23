import { container } from '../../../core/di/container';
import { AdminTypes } from './types';
import { AdminRepository } from '../AdminRepository';

container.bind(AdminTypes.AdminRepository)
    .to(AdminRepository)
    .inSingletonScope();

export { AdminTypes };

