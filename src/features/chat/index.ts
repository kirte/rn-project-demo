/**
 * Chat Feature Entry Point
 * 
 * Features self-register here during module initialization.
 * No changes needed in core when adding this feature!
 */

import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature with the registry
featureRegistry.register({
    name: 'chat',
    description: 'Real-time chat messaging',
    version: '1.0.0',
    loader: async () => {
        const module = await import('./di/chat.module');
        return module.ChatFeatureModule;
    },
    dependencies: ['user'], // Chat needs user profiles
    tags: ['messaging', 'realtime'],
});

// Export types
export { ChatTypes } from './di/types';

// Export services
export { ChatSessionService } from './services/ChatSessionService';

// Export screens
export { ChatScreen } from './ui/ChatScreen';

// Export navigation
export { ChatNavigator, ChatRoutes } from './navigation/navigation';
export type { ChatStackParamList } from './navigation/navigation';

// Note: Feature is registered but NOT loaded yet (lazy loading)
// It will load when first accessed via ensureFeatureLoaded('chat')
