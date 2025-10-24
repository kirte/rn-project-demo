import { container } from '../../../core/di/container';
import { UserTypes } from './types';
import { UserRepository } from '../repositories/UserRepository';
import { CoreTypes } from '../../../core/di/types';

// Lazy registration - only happens when this feature is imported
if (!container.isBound(UserTypes.UserRepository)) {
    // Manually specify the injection instead of relying on @inject decorator
    // This is more reliable in React Native where decorator metadata may not work
    container.bind(UserTypes.UserRepository)
        .toDynamicValue((context) => {
            const apiService = context.container.get(CoreTypes.ApiService);
            return new UserRepository(apiService);
        })
        .inSingletonScope();
}

export { UserTypes };

