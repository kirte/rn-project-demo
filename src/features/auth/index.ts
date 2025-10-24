// Auth Feature Module
// This file serves as the public API for the auth feature

// Initialize DI container for this feature
import './di/container';

// Export types
export { AuthTypes } from './di/types';

// Export screens (public components)
export { LoginScreen } from './ui/LoginScreen';

// Export repository (if needed by other features)
export { AuthRepository } from './repositories/AuthRepository';

// Export navigation
export { AuthNavigator, AuthRoutes } from './navigation/navigation';
export type { AuthStackParamList } from './navigation/navigation';

// Optional: Export a feature initialization function
export const initAuthFeature = () => {
    console.log('Auth feature initialized');
    // Any additional setup logic can go here
};

