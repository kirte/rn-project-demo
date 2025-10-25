/**
 * Chat Feature Module
 * 
 * Registers all chat-related dependencies in the DI container.
 * Called automatically by the feature manager when the chat feature is first accessed.
 */

import { Container } from 'inversify';
import { ChatTypes } from './types';
import { ChatSessionService } from '../services/ChatSessionService';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

/**
 * Register chat feature dependencies
 * Safe to call multiple times - will only register once
 */
function registerChatModule(container: Container): void {
    // Prevent duplicate registration
    if (isRegistered) {
        console.log('[ChatModule] Already registered, skipping');
        return;
    }

    // Register ChatSessionService (no dependencies)
    if (!container.isBound(ChatTypes.ChatSessionService)) {
        container.bind(ChatTypes.ChatSessionService)
            .to(ChatSessionService)
            .inSingletonScope();
    }

    isRegistered = true;
    console.log('[ChatModule] ✅ Registered successfully');
}

/**
 * Export feature module in standard format
 * This is what the feature manager expects
 */
export const ChatFeatureModule: FeatureModule = {
    name: 'chat',
    register: registerChatModule,
};

// Also export for backward compatibility
export { registerChatModule, ChatTypes };

