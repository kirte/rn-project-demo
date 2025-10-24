import { container } from '../../../core/di/container';
import { ChatTypes } from './types';
import { ChatSessionService } from '../services/ChatSessionService';

// Lazy registration - only happens when this feature is imported
if (!container.isBound(ChatTypes.ChatSessionService)) {
    container.bind(ChatTypes.ChatSessionService)
        .toDynamicValue(() => new ChatSessionService())
        .inTransientScope();
}

export { ChatTypes };

