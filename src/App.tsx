import React from 'react';
import { SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { LoginScreen } from './features/auth/LoginScreen';
import { UserScreen } from './features/user/UserScreen';
import { AdminScreen } from './features/admin/AdminScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' />
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <LoginScreen />
        <UserScreen />
        <AdminScreen />
      </ScrollView>
    </SafeAreaView>
  );
}
