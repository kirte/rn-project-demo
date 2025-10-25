/**
 * Auth Feature Entry Point
 * 
 * Features self-register here during module initialization.
 * No changes needed in core when adding this feature!
 */

import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature with the registry
featureRegistry.register({
    name: 'auth',
    description: 'Authentication and authorization',
    version: '1.0.0',
    loader: async () => {
        const module = await import('./di/auth.module');
        return module.AuthFeatureModule;
    },
    tags: ['core', 'security'],
});

// Export types
export { AuthTypes } from './di/types';

// Export screens (public components)
export { LoginScreen } from './ui/LoginScreen';

// Export repository (if needed by other features)
export { AuthRepository } from './repositories/AuthRepository';

// Export navigation
export { AuthNavigator, AuthRoutes } from './navigation/navigation';
export type { AuthStackParamList } from './navigation/navigation';

// Note: Feature is registered but NOT loaded yet (lazy loading)
// It will load when first accessed via ensureFeatureLoaded('auth')
