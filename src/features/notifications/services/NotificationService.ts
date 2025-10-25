/**
 * Notification Service
 * 
 * Manages in-app notifications with rich models
 */

import { injectable } from 'inversify';
import { Notification, NotificationType, NotificationSettings } from '../models/NotificationModel';

@injectable()
export class NotificationService {
    private notifications: Notification[] = [];
    private settings: NotificationSettings = {
        enabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
    };

    /**
     * Get all notifications
     */
    getNotifications(): Notification[] {
        return this.notifications;
    }

    /**
     * Get notifications by type
     */
    getNotificationsByType(type: NotificationType): Notification[] {
        return this.notifications.filter(n => n.type === type);
    }

    /**
     * Get notifications for a specific user
     */
    getNotificationsByUser(userId: number): Notification[] {
        return this.notifications.filter(n => n.userId === userId);
    }

    /**
     * Add a notification
     */
    addNotification(
        title: string,
        message: string,
        type: NotificationType = NotificationType.INFO,
        userId?: number,
        metadata?: Record<string, any>
    ): Notification {
        const notification: Notification = {
            id: Date.now().toString(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
            userId,
            metadata,
        };

        this.notifications.unshift(notification);
        console.log(`[NotificationService] 📬 New ${type} notification:`, title);

        // Simulate notification sound/vibration if enabled
        if (this.settings.enabled) {
            if (this.settings.soundEnabled) {
                console.log('🔔 Play notification sound');
            }
            if (this.settings.vibrationEnabled) {
                console.log('📳 Vibrate device');
            }
        }

        return notification;
    }

    /**
     * Mark notification as read
     */
    markAsRead(id: string): void {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            console.log('[NotificationService] ✅ Marked as read:', id);
        }
    }

    /**
     * Mark all as read
     */
    markAllAsRead(): void {
        this.notifications.forEach(n => n.read = true);
        console.log('[NotificationService] ✅ All marked as read');
    }

    /**
     * Delete a notification
     */
    deleteNotification(id: string): void {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            console.log('[NotificationService] 🗑️ Deleted notification:', id);
        }
    }

    /**
     * Clear all notifications
     */
    clearAll(): void {
        this.notifications = [];
        console.log('[NotificationService] 🗑️ All notifications cleared');
    }

    /**
     * Get unread count
     */
    getUnreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    /**
     * Get notification settings
     */
    getSettings(): NotificationSettings {
        return { ...this.settings };
    }

    /**
     * Update notification settings
     */
    updateSettings(settings: Partial<NotificationSettings>): void {
        this.settings = { ...this.settings, ...settings };
        console.log('[NotificationService] ⚙️ Settings updated:', this.settings);
    }
}

