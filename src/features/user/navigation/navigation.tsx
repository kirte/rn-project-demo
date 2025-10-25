/**
 * User Feature Navigation
 * 
 * This file defines the navigation structure for the user feature.
 * 
 * Note: Feature module is registered when navigator is imported for lazy loading
 */

// Import and register feature module
import { registerUserModule } from '../di/user.module';
import { container } from '../../../core/di/container';

// Register user module when navigator is imported
registerUserModule(container);

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

