import { container } from '../../../core/di/container';
import { AdminTypes } from './types';
import { AdminRepository } from '../repositories/AdminRepository';
import { CoreTypes } from '../../../core/di/types';

// Lazy registration - only happens when this feature is imported
if (!container.isBound(AdminTypes.AdminRepository)) {
    // Manually specify the injection instead of relying on @inject decorator
    // This is more reliable in React Native where decorator metadata may not work
    container.bind(AdminTypes.AdminRepository)
        .toDynamicValue((context) => {
            const apiService = context.container.get(CoreTypes.ApiService);
            return new AdminRepository(apiService);
        })
        .inSingletonScope();
}

export { AdminTypes };

