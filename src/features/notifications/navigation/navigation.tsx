/**
 * Notification Feature Navigation
 * 
 * Navigation structure for notifications feature
 */

import { registerNotificationModule } from '../di/notification.module';
import { container } from '../../../core/di/container';

// Register notification module when navigator is imported
registerNotificationModule(container);

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationScreen } from '../ui/NotificationScreen';
import { NotificationDetailScreen } from '../ui/NotificationDetailScreen';
import { NotificationSettingsScreen } from '../ui/NotificationSettingsScreen';

// Define the param list for notification routes
export type NotificationStackParamList = {
    NotificationList: undefined;
    NotificationDetail: { notificationId: string };
    NotificationSettings: undefined;
};

const Stack = createNativeStackNavigator<NotificationStackParamList>();

/**
 * Notification Navigator
 * 
 * Manages all notification-related screens
 */
export const NotificationNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="NotificationList"
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="NotificationList"
                component={NotificationScreen}
                options={{ title: 'Notifications' }}
            />
            <Stack.Screen
                name="NotificationDetail"
                component={NotificationDetailScreen}
                options={{ title: 'Notification Details' }}
            />
            <Stack.Screen
                name="NotificationSettings"
                component={NotificationSettingsScreen}
                options={{ title: 'Notification Settings' }}
            />
        </Stack.Navigator>
    );
};

// Export route names as constants for type-safe navigation
export const NotificationRoutes = {
    NotificationList: 'NotificationList',
    NotificationDetail: 'NotificationDetail',
    NotificationSettings: 'NotificationSettings',
} as const;

