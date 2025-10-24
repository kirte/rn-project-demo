// Chat Feature Module
// This file serves as the public API for the chat feature

// Initialize DI container for this feature
import './di/container';

// Export types
export { ChatTypes } from './di/types';

// Export services
export { ChatSessionService } from './services/ChatSessionService';

// Export screens
export { ChatScreen } from './ui/ChatScreen';

// Export navigation
export { ChatNavigator, ChatRoutes } from './navigation/navigation';
export type { ChatStackParamList } from './navigation/navigation';

// Optional: Export a feature initialization function
export const initChatFeature = () => {
    console.log('Chat feature initialized');
    // Any additional setup logic can go here
};

