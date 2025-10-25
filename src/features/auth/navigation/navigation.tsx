/**
 * Auth Feature Navigation
 * 
 * This file defines the navigation structure for the auth feature.
 * Each feature manages its own navigation stack and route types.
 * 
 * Note: Feature module is registered when navigator is imported for lazy loading
 */

// Import and register feature module
import { registerAuthModule } from '../di/auth.module';
import { container } from '../../../core/di/container';

// Register auth module when navigator is imported
registerAuthModule(container);

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../ui/LoginScreen';

// Define the param list for this feature's routes
export type AuthStackParamList = {
    Login: undefined;
    // Add more auth screens here as needed
    // Register: undefined;
    // ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Auth Navigator
 * 
 * This navigator can be used standalone or composed into a root navigator.
 */
export const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
            {/* Add more auth screens here */}
        </Stack.Navigator>
    );
};

// Export route names as constants for type-safe navigation
export const AuthRoutes = {
    Login: 'Login',
} as const;

