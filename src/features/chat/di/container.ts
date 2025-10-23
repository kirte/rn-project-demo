import { container } from '../../../core/di/container';
import { ChatTypes } from './types';
import { ChatSessionService } from '../ChatSessionService';

container.bind(ChatTypes.ChatSessionService)
    .toDynamicValue(() => new ChatSessionService())
    .inTransientScope();

export { ChatTypes };

