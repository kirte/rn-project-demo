import { container } from '../../../core/di/container';
import { AuthTypes } from './types';
import { AuthRepository } from '../repositories/AuthRepository';
import { CoreTypes } from '../../../core/di/types';

// Lazy registration - only happens when this feature is imported
if (!container.isBound(AuthTypes.AuthRepository)) {
    // Manually specify the injection instead of relying on @inject decorator
    // This is more reliable in React Native where decorator metadata may not work
    container.bind(AuthTypes.AuthRepository)
        .toDynamicValue((context) => {
            const apiService = context.container.get(CoreTypes.ApiService);
            return new AuthRepository(apiService);
        })
        .inSingletonScope();
}

export { AuthTypes };

