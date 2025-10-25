/**
 * Admin Feature Module
 * 
 * Registers all admin-related dependencies in the DI container.
 * Called automatically by the feature manager when the admin feature is first accessed.
 */

import { Container } from 'inversify';
import { AdminTypes } from './types';
import { AdminRepository } from '../repositories/AdminRepository';
import { CoreTypes } from '../../../core/di/types';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

/**
 * Register admin feature dependencies
 * Safe to call multiple times - will only register once
 */
function registerAdminModule(container: Container): void {
    // Prevent duplicate registration
    if (isRegistered) {
        console.log('[AdminModule] Already registered, skipping');
        return;
    }

    // Register AdminRepository with manual dependency injection
    if (!container.isBound(AdminTypes.AdminRepository)) {
        container.bind(AdminTypes.AdminRepository)
            .toDynamicValue((context) => {
                const apiService = context.container.get(CoreTypes.ApiService);
                return new AdminRepository(apiService);
            })
            .inSingletonScope();
    }

    isRegistered = true;
    console.log('[AdminModule] ✅ Registered successfully');
}

/**
 * Export feature module in standard format
 * This is what the feature manager expects
 */
export const AdminFeatureModule: FeatureModule = {
    name: 'admin',
    register: registerAdminModule,
};

// Also export for backward compatibility
export { registerAdminModule, AdminTypes };

