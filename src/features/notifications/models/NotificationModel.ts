/**
 * Notification Model
 * 
 * Data model for notifications
 */

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: Date;
    read: boolean;
    userId?: number;
    metadata?: Record<string, any>;
}

export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    CHAT = 'chat',
    USER = 'user',
    SYSTEM = 'system',
}

export interface NotificationSettings {
    enabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
}

