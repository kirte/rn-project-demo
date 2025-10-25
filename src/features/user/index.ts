/**
 * User Feature Entry Point
 * 
 * Features self-register here during module initialization.
 * No changes needed in core when adding this feature!
 */

import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature with the registry
featureRegistry.register({
    name: 'user',
    description: 'User profile and management',
    version: '1.0.0',
    loader: async () => {
        const module = await import('./di/user.module');
        return module.UserFeatureModule;
    },
    dependencies: ['auth'], // User feature depends on auth
    tags: ['core', 'profile'],
});

// Export types
export { UserTypes } from './di/types';

// Export screens (public components)
export { UserScreen } from './ui/UserScreen';

// Export models/types
export type { User } from './models/UserModel';

// Export repository (if needed by other features)
export { UserRepository } from './repositories/UserRepository';

// Export navigation
export { UserNavigator, UserRoutes } from './navigation/navigation';
export type { UserStackParamList } from './navigation/navigation';

// Note: Feature is registered but NOT loaded yet (lazy loading)
// It will load when first accessed via ensureFeatureLoaded('user')
