/**
 * Notifications Feature Entry Point
 * 
 * Example: Adding a NEW feature with ZERO core changes!
 * Just create this feature and import it in App.tsx
 */

import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature with the registry
featureRegistry.register({
    name: 'notifications',
    description: 'In-app notification system',
    version: '1.0.0',
    loader: async () => {
        const module = await import('./di/notification.module');
        return module.NotificationFeatureModule;
    },
    tags: ['messaging', 'alerts'],
});

// Export types
export { NotificationTypes } from './di/types';

// Export models
export type { Notification, NotificationSettings } from './models/NotificationModel';
export { NotificationType } from './models/NotificationModel';

// Export services
export { NotificationService } from './services/NotificationService';

// Export screens
export { NotificationScreen } from './ui/NotificationScreen';
export { NotificationDetailScreen } from './ui/NotificationDetailScreen';
export { NotificationSettingsScreen } from './ui/NotificationSettingsScreen';

// Export navigation
export { NotificationNavigator, NotificationRoutes } from './navigation/navigation';
export type { NotificationStackParamList } from './navigation/navigation';

// That's it! Feature is now registered and can be loaded dynamically
// No changes needed in core code!

