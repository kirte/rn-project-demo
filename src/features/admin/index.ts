// Admin Feature Module
// This file serves as the public API for the admin feature

// Initialize DI container for this feature
import './di/container';

// Export types
export { AdminTypes } from './di/types';

// Export screens (public components)
export { AdminScreen } from './ui/AdminScreen';

// Export repository (if needed by other features)
export { AdminRepository } from './repositories/AdminRepository';

// Export navigation
export { AdminNavigator, AdminRoutes } from './navigation/navigation';
export type { AdminStackParamList } from './navigation/navigation';

// Optional: Export a feature initialization function
export const initAdminFeature = () => {
    console.log('Admin feature initialized');
    // Any additional setup logic can go here
};

