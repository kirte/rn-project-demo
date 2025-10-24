/**
 * Features Module Index
 * 
 * This file centralizes all feature modules and their initialization.
 * Import this file in your App.tsx to initialize all features at once.
 * 
 * Each feature module:
 * - Registers its DI bindings when imported
 * - Exports its public API (screens, services, types)
 * - Encapsulates internal implementation details
 */

// Import and re-export all features
// The import alone will initialize the DI containers

// Auth Feature
export {
    LoginScreen,
    AuthRepository,
    AuthTypes,
    initAuthFeature,
} from './auth';

// User Feature
export {
    UserScreen,
    UserRepository,
    UserTypes,
    initUserFeature,
} from './user';
export type { User } from './user';

// Admin Feature
export {
    AdminScreen,
    AdminRepository,
    AdminTypes,
    initAdminFeature,
} from './admin';

// Chat Feature
export {
    ChatSessionService,
    ChatTypes,
    initChatFeature,
} from './chat';

/**
 * Initialize all features at once
 * Call this function in your App.tsx or index file
 */
export const initializeAllFeatures = () => {
    console.log('Initializing all features...');

    // Features are auto-initialized by importing their index files
    // But you can add additional setup logic here if needed

    console.log('All features initialized successfully');
};

