// User Feature Module
// This file serves as the public API for the user feature

// Initialize DI container for this feature
import './di/container';

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

// Optional: Export a feature initialization function
export const initUserFeature = () => {
    console.log('User feature initialized');
    // Any additional setup logic can go here
};

