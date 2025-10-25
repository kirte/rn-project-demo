/**
 * User Feature Module
 * 
 * Registers all user-related dependencies in the DI container.
 * Called automatically by the feature manager when the user feature is first accessed.
 */

import { Container } from 'inversify';
import { UserTypes } from './types';
import { UserRepository } from '../repositories/UserRepository';
import { CoreTypes } from '../../../core/di/types';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

/**
 * Register user feature dependencies
 * Safe to call multiple times - will only register once
 */
function registerUserModule(container: Container): void {
    // Prevent duplicate registration
    if (isRegistered) {
        console.log('[UserModule] Already registered, skipping');
        return;
    }

    // Register UserRepository with manual dependency injection
    if (!container.isBound(UserTypes.UserRepository)) {
        container.bind(UserTypes.UserRepository)
            .toDynamicValue((context) => {
                const apiService = context.container.get(CoreTypes.ApiService);
                return new UserRepository(apiService);
            })
            .inSingletonScope();
    }

    isRegistered = true;
    console.log('[UserModule] ✅ Registered successfully');
}

/**
 * Export feature module in standard format
 * This is what the feature manager expects
 */
export const UserFeatureModule: FeatureModule = {
    name: 'user',
    register: registerUserModule,
};

// Also export for backward compatibility
export { registerUserModule, UserTypes };

