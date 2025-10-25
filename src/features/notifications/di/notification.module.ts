/**
 * Notification Feature Module
 * 
 * Example of adding a new feature with zero core changes!
 */

import { Container } from 'inversify';
import { NotificationTypes } from './types';
import { NotificationService } from '../services/NotificationService';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

/**
 * Register notification feature dependencies
 */
function registerNotificationModule(container: Container): void {
    if (isRegistered) {
        console.log('[NotificationModule] Already registered, skipping');
        return;
    }

    if (!container.isBound(NotificationTypes.NotificationService)) {
        container.bind(NotificationTypes.NotificationService)
            .to(NotificationService)
            .inSingletonScope();
    }

    isRegistered = true;
    console.log('[NotificationModule] ✅ Registered successfully');
}

/**
 * Export feature module in standard format
 */
export const NotificationFeatureModule: FeatureModule = {
    name: 'notifications',
    register: registerNotificationModule,
};

export { registerNotificationModule, NotificationTypes };

