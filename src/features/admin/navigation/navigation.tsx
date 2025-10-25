/**
 * Admin Feature Navigation
 * 
 * This file defines the navigation structure for the admin feature.
 * 
 * Note: Feature module is registered when navigator is imported for lazy loading
 */

// Import and register feature module
import { registerAdminModule } from '../di/admin.module';
import { container } from '../../../core/di/container';

// Register admin module when navigator is imported
registerAdminModule(container);

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminScreen } from '../ui/AdminScreen';

// Define the param list for this feature's routes
export type AdminStackParamList = {
    AdminDashboard: undefined;
    // Add more admin screens here as needed
    // AdminUsers: undefined;
    // AdminSettings: undefined;
    // AdminReports: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

/**
 * Admin Navigator
 * 
 * This navigator manages all admin-related screens.
 */
export const AdminNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="AdminDashboard"
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="AdminDashboard"
                component={AdminScreen}
                options={{ title: 'Admin Dashboard' }}
            />
            {/* Add more admin screens here */}
        </Stack.Navigator>
    );
};

// Export route names as constants for type-safe navigation
export const AdminRoutes = {
    AdminDashboard: 'AdminDashboard',
} as const;

