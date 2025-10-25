# Dynamic Feature Loading - Complete Examples

This document demonstrates all aspects of the dynamic feature loading system with real examples.

---

## 🎯 Table of Contents

1. [Example 1: Calling API from Unloaded Feature](#example-1-calling-api-from-unloaded-feature)
2. [Example 2: Navigation to Unloaded Feature](#example-2-navigation-to-unloaded-feature)
3. [Example 3: Adding a New Feature](#example-3-adding-a-new-feature)
4. [Example 4: Cross-Feature Communication](#example-4-cross-feature-communication)
5. [Example 5: Preloading Features](#example-5-preloading-features)
6. [Example 6: Feature Discovery](#example-6-feature-discovery)

---

## Example 1: Calling API from Unloaded Feature

### Scenario
You're in the **Chat Screen** and want to display user profile information, but the **User Feature** hasn't been loaded yet.

###Solution: Use `useFeatureService`

```typescript
// src/features/chat/ui/ChatScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useFeatureService } from '../../../core/hooks/useService';
import { UserTypes } from '../../user/di/types';
import { UserRepository } from '../../user/repositories/UserRepository';
import { User } from '../../user/models/User';

export const ChatScreen = () => {
  // ✅ Automatically loads user feature if not loaded
  const { service: userRepo, isLoading: isUserRepoLoading, error } = useFeatureService<UserRepository>(
    'user', // Feature name (any string!)
    UserTypes.UserRepository
  );

  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userRepo) return;

      setIsLoadingUser(true);
      const result = await userRepo.getUser(1); // Load user with ID 1

      if (result.success) {
        setUser(result.data);
        console.log('✅ Loaded user from unloaded feature:', result.data.name);
      } else {
        console.error('❌ Failed to load user:', result.error);
      }

      setIsLoadingUser(false);
    };

    loadUserProfile();
  }, [userRepo]);

  // Handle feature loading state
  if (isUserRepoLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading user feature...</Text>
      </View>
    );
  }

  // Handle feature loading error
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading user feature</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  // Handle user data loading
  if (isLoadingUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.title}>Chatting with:</Text>
        {user && (
          <>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </>
        )}
      </View>
      
      {/* Chat messages go here */}
      <Text style={styles.subtitle}>Messages will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#666' },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },
  errorDetail: { marginTop: 8, color: '#666' },
  userCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 14, color: '#666', marginBottom: 8 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#666' },
  subtitle: { color: '#999', textAlign: 'center', marginTop: 32 },
});
```

**What Happens:**
1. `useFeatureService('user', ...)` is called
2. Feature Manager checks if 'user' is loaded → No
3. Dynamic import: `import('./di/user.module')`
4. `registerUserModule(container)` called → UserRepository registered
5. Hook returns UserRepository instance
6. Component can now call `userRepo.getUser()`

---

## Example 2: Navigation to Unloaded Feature

### Scenario
You want to navigate to the **Notifications Screen**, but the feature isn't loaded yet.

### Solution: Feature loads automatically via navigation

```typescript
// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../features/auth/ui/LoginScreen';
import { UserNavigator } from '../features/user';
import { AdminNavigator } from '../features/admin';
import { ChatScreen } from '../features/chat';
// NEW: Import notification screen
import { NotificationScreen } from '../features/notifications';

export type MainTabParamList = {
  UserTab: undefined;
  AdminTab: undefined;
  ChatTab: undefined;
  NotificationsTab: undefined; // NEW
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="UserTab" component={UserNavigator} options={{ title: 'Profile' }} />
    <Tab.Screen name="AdminTab" component={AdminNavigator} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="ChatTab" component={ChatScreen} options={{ title: 'Chat' }} />
    
    {/* NEW: Add notifications tab */}
    <Tab.Screen 
      name="NotificationsTab" 
      component={NotificationScreen} 
      options={{ title: 'Notifications' }} 
    />
  </Tab.Navigator>
);

// ... rest of navigator
```

**How It Works:**
```typescript
// When user taps Notifications tab:
// 1. React Navigation imports NotificationScreen
// 2. NotificationScreen imports useService(NotificationTypes.NotificationService)
// 3. NotificationService isn't bound → Feature not loaded yet
// 4. User sees error OR we can use useFeatureService:

// Better approach in NotificationScreen:
const { service: notificationService, isLoading } = useFeatureService<NotificationService>(
  'notifications',
  NotificationTypes.NotificationService
);

if (isLoading) return <LoadingSpinner />;
// Now service is guaranteed to be loaded!
```

---

## Example 3: Adding a New Feature

### Scenario
Add a complete **Notifications** feature with zero core changes.

### Step 1: Create Feature Structure

```bash
src/features/notifications/
├── di/
│   ├── types.ts                    # DI types
│   └── notification.module.ts      # Module registration
├── services/
│   └── NotificationService.ts      # Business logic
├── ui/
│   └── NotificationScreen.tsx      # UI component
└── index.ts                        # Self-registration
```

### Step 2: Define DI Types

```typescript
// src/features/notifications/di/types.ts
export const NotificationTypes = {
  NotificationService: Symbol.for('NotificationService'),
} as const;
```

### Step 3: Create Feature Module

```typescript
// src/features/notifications/di/notification.module.ts
import { Container } from 'inversify';
import { NotificationTypes } from './types';
import { NotificationService } from '../services/NotificationService';
import { FeatureModule } from '../../../core/di/featureRegistry';

let isRegistered = false;

function registerNotificationModule(container: Container): void {
  if (isRegistered) return;

  if (!container.isBound(NotificationTypes.NotificationService)) {
    container.bind(NotificationTypes.NotificationService)
      .to(NotificationService)
      .inSingletonScope();
  }

  isRegistered = true;
  console.log('[NotificationModule] ✅ Registered successfully');
}

export const NotificationFeatureModule: FeatureModule = {
  name: 'notifications',
  register: registerNotificationModule,
};
```

### Step 4: Self-Register Feature

```typescript
// src/features/notifications/index.ts
import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register - NO core changes needed!
featureRegistry.register({
  name: 'notifications',
  description: 'In-app notification system',
  version: '1.0.0',
  loader: async () => {
    const module = await import('./di/notification.module');
    return module.NotificationFeatureModule;
  },
  tags: ['messaging', 'alerts'],
});

export { NotificationTypes } from './di/types';
export { NotificationService } from './services/NotificationService';
export { NotificationScreen } from './ui/NotificationScreen';
```

### Step 5: Import in App.tsx

```typescript
// src/App.tsx
import './core/di/container';

// Import all features (including new one!)
import './features/auth';
import './features/user';
import './features/admin';
import './features/chat';
import './features/notifications'; // ✅ NEW: Just add this line!

// ... rest of app
```

**That's it!** Feature is now available:
- ✅ Can be loaded via `ensureFeatureLoaded('notifications')`
- ✅ Can be used via `useFeatureService('notifications', ...)`
- ✅ Zero changes to core code
- ✅ Can be removed just as easily

---

## Example 4: Cross-Feature Communication

### Scenario
Admin feature wants to send a notification when dashboard data changes.

```typescript
// src/features/admin/ui/AdminScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useService } from '../../../core/hooks/useService';
import { useFeatureService } from '../../../core/hooks/useService';
import { AdminTypes } from '../di/types';
import { AdminRepository } from '../repositories/AdminRepository';
import { NotificationTypes } from '../../notifications/di/types';
import { NotificationService } from '../../notifications/services/NotificationService';

export const AdminScreen = () => {
  const adminRepo = useService<AdminRepository>(AdminTypes.AdminRepository);
  
  // ✅ Load notifications feature automatically
  const { service: notificationService, isLoading: isNotificationLoading } = useFeatureService<NotificationService>(
    'notifications',
    NotificationTypes.NotificationService
  );

  const [dashboardData, setDashboardData] = useState(null);

  const loadDashboard = async () => {
    const result = await adminRepo.getDashboard();
    
    if (result.success) {
      setDashboardData(result.data);
      
      // ✅ Send notification (cross-feature communication!)
      if (notificationService) {
        notificationService.addNotification(
          'Dashboard Updated',
          'New dashboard data loaded successfully'
        );
      }
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <View>
      <Text>Admin Dashboard</Text>
      {/* Dashboard content */}
      <Button title="Refresh" onPress={loadDashboard} />
    </View>
  );
};
```

**Benefits:**
- ✅ Admin feature can use Notifications feature
- ✅ Notifications loads automatically when needed
- ✅ No tight coupling between features
- ✅ Features remain independent

---

## Example 5: Preloading Features

### Scenario
After login, preload all features for smooth UX.

```typescript
// src/features/auth/ui/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { preloadFeatures } from '../../../core/di/featureManager';
import { useService } from '../../../core/hooks/useService';
import { CoreTypes } from '../../../core/di/types';
import { AuthService } from '../../../core/auth/AuthService';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const authService = useService<AuthService>(CoreTypes.AuthService);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    const result = await authService.login(username, password);
    
    if (result.success) {
      // ✅ Preload all features in parallel
      setIsPreloading(true);
      await preloadFeatures(['user', 'admin', 'chat', 'notifications']);
      setIsPreloading(false);
      
      // Navigate - all features ready!
      navigation.replace('MainTabs');
    }
    
    setIsLoading(false);
  };

  if (isPreloading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading app features...</Text>
      </View>
    );
  }

  return (
    <View>
      <TextInput value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={handleLogin} disabled={isLoading} />
    </View>
  );
};
```

---

## Example 6: Feature Discovery

### Scenario
Display all available features in a debug screen.

```typescript
// src/debug/FeatureDebugScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {
  getRegisteredFeatures,
  getLoadedFeatures,
  getFeatureMetadata,
  getFeatureStats,
  ensureFeatureLoaded,
} from '../core/di/featureManager';

export const FeatureDebugScreen = () => {
  const [stats, setStats] = useState(getFeatureStats());
  const registered = getRegisteredFeatures();

  const refresh = () => {
    setStats(getFeatureStats());
  };

  const handleLoadFeature = async (featureName: string) => {
    await ensureFeatureLoaded(featureName);
    refresh();
  };

  const renderFeature = ({ item }: { item: string }) => {
    const isLoaded = stats.loadedList.includes(item);
    const metadata = getFeatureMetadata(item);

    return (
      <View style={styles.featureItem}>
        <View style={styles.featureHeader}>
          <Text style={styles.featureName}>{item}</Text>
          <View style={[styles.badge, isLoaded && styles.badgeLoaded]}>
            <Text style={styles.badgeText}>
              {isLoaded ? '✓ Loaded' : 'Not Loaded'}
            </Text>
          </View>
        </View>
        
        {metadata && (
          <>
            <Text style={styles.featureDesc}>{metadata.description}</Text>
            <Text style={styles.featureVersion}>v{metadata.version}</Text>
            {metadata.dependencies && metadata.dependencies.length > 0 && (
              <Text style={styles.featureDeps}>
                Depends on: {metadata.dependencies.join(', ')}
              </Text>
            )}
            {metadata.tags && (
              <Text style={styles.featureTags}>
                Tags: {metadata.tags.join(', ')}
              </Text>
            )}
          </>
        )}

        {!isLoaded && (
          <TouchableOpacity
            style={styles.loadButton}
            onPress={() => handleLoadFeature(item)}
          >
            <Text style={styles.loadButtonText}>Load Feature</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feature Registry</Text>
        <TouchableOpacity onPress={refresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          📝 Registered: {stats.registered} | ✅ Loaded: {stats.loaded}
        </Text>
      </View>

      <FlatList
        data={registered}
        renderItem={renderFeature}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  refreshButton: { padding: 8 },
  refreshText: { color: '#fff', fontWeight: '600' },
  stats: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  statsText: { fontSize: 16 },
  list: { padding: 16 },
  featureItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  featureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  featureName: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#e0e0e0' },
  badgeLoaded: { backgroundColor: '#4CAF50' },
  badgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  featureDesc: { fontSize: 14, color: '#666', marginBottom: 4 },
  featureVersion: { fontSize: 12, color: '#999', marginBottom: 4 },
  featureDeps: { fontSize: 12, color: '#007AFF', marginTop: 4 },
  featureTags: { fontSize: 12, color: '#666', marginTop: 2 },
  loadButton: { marginTop: 12, padding: 12, backgroundColor: '#007AFF', borderRadius: 8 },
  loadButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
```

---

## 🎯 Summary

### ✅ What You Can Do Now

1. **Call APIs from unloaded features** - Use `useFeatureService()`
2. **Navigate to unloaded features** - Works automatically
3. **Add new features** - Just create folder + import in App.tsx
4. **Cross-feature communication** - Features can use each other
5. **Preload features** - Better UX after login
6. **Feature discovery** - Debug and monitor features

### 🚀 Key Benefits

- ✅ **Zero core changes** when adding features
- ✅ **Fast startup** - only core services loaded
- ✅ **Lazy loading** - features load on-demand
- ✅ **Type-safe** - full TypeScript support
- ✅ **Maintainable** - clean separation of concerns
- ✅ **Scalable** - add unlimited features

### 📚 Next Steps

1. Try adding your own feature!
2. Use `useFeatureService` in your screens
3. Implement cross-feature communication
4. Add feature discovery to your debug menu

---

**Created**: 2024  
**Architecture**: Dynamic Feature-Based with Self-Registration

