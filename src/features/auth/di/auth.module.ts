/**
 * Auth Feature Module
 * 
 * Registers all auth-related dependencies in the DI container.
 * Called automatically by the feature manager when the auth feature is first accessed.
 */

import { Container } from 'inversify';
import { AuthTypes } from './types';
import { AuthRepository } from '../repositories/AuthRepository';
import { CoreTypes } from '../../../core/di/types';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

/**
 * Register auth feature dependencies
 * Safe to call multiple times - will only register once
 */
function registerAuthModule(container: Container): void {
    // Prevent duplicate registration
    if (isRegistered) {
        console.log('[AuthModule] Already registered, skipping');
        return;
    }

    // Register AuthRepository with manual dependency injection
    if (!container.isBound(AuthTypes.AuthRepository)) {
        container.bind(AuthTypes.AuthRepository)
            .toDynamicValue((context) => {
                const apiService = context.container.get(CoreTypes.ApiService);
                return new AuthRepository(apiService);
            })
            .inSingletonScope();
    }

    isRegistered = true;
    console.log('[AuthModule] ✅ Registered successfully');
}

/**
 * Export feature module in standard format
 * This is what the feature manager expects
 */
export const AuthFeatureModule: FeatureModule = {
    name: 'auth',
    register: registerAuthModule,
};

// Also export for backward compatibility
export { registerAuthModule, AuthTypes };

