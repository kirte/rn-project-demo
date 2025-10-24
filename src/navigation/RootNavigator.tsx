/**
 * Root Navigation
 * 
 * Login-first navigation pattern with bottom tabs after authentication
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import feature navigators
import { LoginScreen } from '../features/auth/ui/LoginScreen';
import { UserNavigator } from '../features/user/index';
import { AdminNavigator } from '../features/admin/index';
import { ChatScreen } from '../features/chat/ui/ChatScreen';

// Define navigation param lists
export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
};

export type MainTabParamList = {
    UserTab: undefined;
    AdminTab: undefined;
    ChatTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator (after login)
 * Contains: User, Admin, Chat
 */
const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="UserTab"
                component={UserNavigator}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>👤</Text>,
                }}
            />
            <Tab.Screen
                name="AdminTab"
                component={AdminNavigator}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>📊</Text>,
                }}
            />
            <Tab.Screen
                name="ChatTab"
                component={ChatScreen}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>💬</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

/**
 * Root Stack Navigator
 * Login → Main Tabs
 */
export const RootNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MainTabs"
                component={MainTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

/**
 * App Navigation Container
 * 
 * Main entry point for navigation
 */
export const AppNavigation: React.FC = () => {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
};

