/**
 * Chat Feature Navigation
 * 
 * This file defines the navigation structure for the chat feature.
 */

// CRITICAL: Import DI container FIRST before importing screens
// This ensures ChatSessionService is registered before screens load
import '../di/container';

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Placeholder chat screen (create proper screen later)
const ChatListScreen = () => (
    <View style={{ padding: 16 }}>
        <Text>Chat List (Coming Soon)</Text>
    </View>
);

// Define the param list for this feature's routes
export type ChatStackParamList = {
    ChatList: undefined;
    // Add more chat screens here as needed
    // ChatRoom: { roomId: string };
    // ChatSettings: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

/**
 * Chat Navigator
 * 
 * This navigator manages all chat-related screens.
 */
export const ChatNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ChatList"
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ title: 'Chats' }}
            />
            {/* Add more chat screens here */}
        </Stack.Navigator>
    );
};

// Export route names as constants for type-safe navigation
export const ChatRoutes = {
    ChatList: 'ChatList',
} as const;

