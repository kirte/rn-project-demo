/**
 * User Feature Navigation
 * 
 * This file defines the navigation structure for the user feature.
 */

// CRITICAL: Import DI container FIRST before importing screens
// This ensures UserRepository is registered before UserScreen loads
import '../di/container';

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserScreen } from '../ui/UserScreen';

// Define the param list for this feature's routes
export type UserStackParamList = {
    UserProfile: { userId?: string };
    UserList: undefined;
    // Add more user screens here as needed
    // UserEdit: { userId: string };
    // UserSettings: undefined;
};

const Stack = createNativeStackNavigator<UserStackParamList>();

/**
 * User Navigator
 * 
 * This navigator manages all user-related screens.
 */
export const UserNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="UserProfile"
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="UserProfile"
                component={UserScreen}
                options={{ title: 'User Profile' }}
            />
            {/* Add more user screens here */}
        </Stack.Navigator>
    );
};

// Export route names as constants for type-safe navigation
export const UserRoutes = {
    UserProfile: 'UserProfile',
    UserList: 'UserList',
} as const;

