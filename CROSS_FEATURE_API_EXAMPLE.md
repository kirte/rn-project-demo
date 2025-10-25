# Cross-Feature API Call Example

This document demonstrates how to call APIs from features that aren't loaded yet using the Feature Manager.

## Scenario

You're in the **Chat Feature** and want to display user profile information. The **User Feature** might not be loaded yet, but you need to call `UserRepository.getUser()`.

## Solution

Use `useFeatureService` hook which automatically loads the feature before accessing its services.

## Example Implementation

### Option 1: Using `useFeatureService` Hook in Component

```typescript
// src/features/chat/ui/ChatScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFeatureService } from '../../../core/hooks/useService';
import { UserTypes } from '../../user/di/types';
import { UserRepository } from '../../user/repositories/UserRepository';
import { User } from '../../user/models/User';

export const ChatScreen = () => {
  // Automatically loads user feature if not loaded
  const { service: userRepo, isLoading: isUserRepoLoading, error } = useFeatureService<UserRepository>(
    'user',
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
      }

      setIsLoadingUser(false);
    };

    loadUserProfile();
  }, [userRepo]);

  if (isUserRepoLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading user feature...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading user feature: {error.message}</Text>
      </View>
    );
  }

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
      <Text style={styles.title}>Chat with {user?.name || 'User'}</Text>
      <Text>Email: {user?.email}</Text>
      {/* Rest of chat UI */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

### Option 2: Using `ensureFeatureLoaded` in Service/Utility

```typescript
// src/features/chat/services/ChatUserService.ts
import { ensureFeatureLoaded } from '../../../core/di/featureManager';
import { container } from '../../../core/di/container';
import { UserTypes } from '../../user/di/types';
import { UserRepository } from '../../user/repositories/UserRepository';
import { User } from '../../user/models/User';

export class ChatUserService {
  /**
   * Load user profile for chat
   * Automatically loads user feature if not loaded
   */
  async getUserProfile(userId: number): Promise<User | null> {
    // Ensure user feature is loaded
    await ensureFeatureLoaded('user');

    // Now safe to get UserRepository
    const userRepo = container.get<UserRepository>(UserTypes.UserRepository);

    // Call the API
    const result = await userRepo.getUser(userId);

    if (result.success) {
      return result.data;
    }

    console.error('Failed to load user:', result.error);
    return null;
  }
}
```

Then use in component:

```typescript
// src/features/chat/ui/ChatScreen.tsx
import React, { useEffect, useState } from 'react';
import { ChatUserService } from '../services/ChatUserService';
import { User } from '../../user/models/User';

export const ChatScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const chatUserService = new ChatUserService();
      const userData = await chatUserService.getUserProfile(1);
      setUser(userData);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // ... rest of component
};
```

### Option 3: Preload Features After Login

```typescript
// src/features/auth/ui/LoginScreen.tsx
import { preloadFeatures } from '../../../core/di/featureManager';

const handleLoginSuccess = async () => {
  // Preload all features in parallel for better UX
  await preloadFeatures(['user', 'admin', 'chat']);

  // Navigate to main app - all features are now ready
  navigation.replace('MainTabs');
};
```

## Benefits

1. **Automatic Loading**: Features load automatically when needed
2. **No Manual Coordination**: Don't need to manually track which features are loaded
3. **Type-Safe**: Full TypeScript support with proper error handling
4. **Loading States**: Built-in loading and error states for better UX
5. **No Duplication**: Feature only loads once, even if called multiple times
6. **Race Condition Safe**: Multiple simultaneous calls wait for single load

## When to Use Each Pattern

### Use `useFeatureService` when:
- You're in a React component
- The feature might not be loaded yet
- You want built-in loading and error states

### Use `ensureFeatureLoaded` when:
- You're in a service or utility function (outside React)
- You need more control over the loading process
- You're calling multiple services from the same feature

### Use `preloadFeatures` when:
- You want to load features eagerly (e.g., after login)
- You know which features will be needed soon
- You want to improve perceived performance

## Important Notes

- ✅ Features are **singleton** - they only register once
- ✅ Multiple calls are **safe** - subsequent calls return immediately
- ✅ Calls are **async-safe** - concurrent loads wait for single registration
- ⚠️ Only use for **cross-feature** calls - within same feature, use `useService`

