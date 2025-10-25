/**
 * Admin Feature Entry Point
 * 
 * Features self-register here during module initialization.
 * No changes needed in core when adding this feature!
 */

import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature with the registry
featureRegistry.register({
    name: 'admin',
    description: 'Admin dashboard and management',
    version: '1.0.0',
    loader: async () => {
        const module = await import('./di/admin.module');
        return module.AdminFeatureModule;
    },
    dependencies: ['auth'], // Admin feature depends on auth
    tags: ['admin', 'management'],
});

// Export types
export { AdminTypes } from './di/types';

// Export screens (public components)
export { AdminScreen } from './ui/AdminScreen';

// Export repository (if needed by other features)
export { AdminRepository } from './repositories/AdminRepository';

// Export navigation
export { AdminNavigator, AdminRoutes } from './navigation/navigation';
export type { AdminStackParamList } from './navigation/navigation';

// Note: Feature is registered but NOT loaded yet (lazy loading)
// It will load when first accessed via ensureFeatureLoaded('admin')
