# React Native MVVM Demo

A modern React Native application with **feature-based architecture**, **MVVM pattern**, and **dynamic dependency injection**.

## Features

- ✨ **Dynamic Feature Loading** - Add/remove features with zero core changes
- ✨ **MVVM Architecture** - ViewModels as React hooks
- ✨ **Dependency Injection** - Self-registering features with InversifyJS
- ✨ **Login-First Navigation** - Secure authentication flow
- ✨ **Type-Safe API** - ApiResult pattern for error handling
- ✨ **Cross-Feature Communication** - Call APIs from unloaded features

## Quick Start

```bash
# Install dependencies
npm install

# Clear cache (important for DI changes)
npx react-native start --reset-cache

# Run on Android/iOS
npx react-native run-android
npx react-native run-ios
```

## Project Structure

```
src/
├── core/
│   ├── api/           # ApiService, ApiResult
│   ├── di/            # Feature registry & manager
│   │   ├── featureRegistry.ts    # Dynamic registration
│   │   └── featureManager.ts     # Lazy loading
│   ├── auth/          # AuthService
│   └── hooks/         # useService, useFeatureService
│
├── features/
│   ├── auth/          # Login feature
│   ├── user/          # User profile
│   ├── admin/         # Dashboard
│   ├── chat/          # Messaging
│   └── notifications/ # Notifications (example)
│       ├── di/                # Self-registration
│       ├── models/            # Data models
│       ├── services/          # Business logic
│       ├── ui/                # Screens
│       ├── navigation/        # Stack navigator
│       └── index.ts           # Feature entry
│
└── navigation/        # App navigation
```

## Dynamic Features

### How It Works

Features **self-register** at startup and **load on-demand** when first accessed.

**No hardcoded feature names in core!**

### Add a New Feature (3 Steps)

```typescript
// 1. Create feature structure
mkdir -p src/features/myfeature/{di,services,ui}

// 2. Self-register in index.ts
featureRegistry.register({
  name: 'myfeature',
  loader: async () => import('./di/myfeature.module'),
});

// 3. Import in App.tsx
import './features/myfeature';
```

**That's it!** No core code changes needed.

### Call API from Unloaded Feature

```typescript
// Feature loads automatically if not loaded
const { service, isLoading } = useFeatureService<UserRepository>(
  'user',
  UserTypes.UserRepository
);

if (!isLoading) {
  const result = await service.getUser(1);
}
```

### Cross-Feature Example

```typescript
// User feature → Notifications feature
const { service: notif } = useFeatureService('notifications', NotificationTypes.NotificationService);

notif.addNotification(
  'Profile Viewed',
  'User viewed their profile',
  NotificationType.USER
);
```

## Architecture

### MVVM Pattern

```typescript
// ViewModel (Business Logic)
export const useUserViewModel = (repository: UserRepository) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadUser = async () => {
    const result = await repository.getUser(1);
    if (result.success) setUser(result.data);
  };
  
  return { user, isLoading, loadUser };
};

// View (UI)
const UserScreen = () => {
  const repo = useService<UserRepository>(UserTypes.UserRepository);
  const { user, isLoading } = useUserViewModel(repo);
  
  if (isLoading) return <Loading />;
  return <Text>{user?.name}</Text>;
};
```

### Dependency Injection

**Manual DI** (React Native compatible):

```typescript
// Feature module
export const UserFeatureModule: FeatureModule = {
  name: 'user',
  register: (container) => {
    container.bind(UserTypes.UserRepository)
      .toDynamicValue((context) => {
        const api = context.container.get(CoreTypes.ApiService);
        return new UserRepository(api);
      })
      .inSingletonScope();
  },
};

// Self-registration
featureRegistry.register({
  name: 'user',
  loader: async () => import('./di/user.module'),
});
```

### API Layer

Type-safe error handling with discriminated unions:

```typescript
// ApiResult type
type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Usage
const result = await userRepo.getUser(1);
if (result.success) {
  console.log(result.data.name); // TypeScript knows data exists
} else {
  console.error(result.error);    // TypeScript knows error exists
}
```

### Navigation

```
App Entry
  ↓
Stack Navigator
  ├─ Login (initial)
  └─ Main Tabs
      ├─ Profile (UserNavigator)
      ├─ Dashboard (AdminNavigator)
      ├─ Chat (ChatScreen)
      └─ Notifications (NotificationNavigator)
```

## Key Technical Decisions

### Why Manual DI?

React Native's Babel doesn't support TypeScript's `emitDecoratorMetadata`. We use explicit `toDynamicValue()` for reliable dependency injection.

### Why ViewModels as Hooks?

Leverages React's built-in state management while keeping business logic separate from UI.

### Why Dynamic Features?

- **Fast Startup** - Only core services load initially
- **Lazy Loading** - Features load when first accessed
- **Zero Core Changes** - Add/remove features without modifying core
- **True Modularity** - Features are completely independent

## Development

```bash
# Start Metro
npm start

# Clear all caches
npx react-native start --reset-cache
rm -rf node_modules/.cache
cd android && ./gradlew clean && cd ..

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

## Troubleshooting

### DI Container Errors

**Error**: `Service not registered in container`

**Solution**: Use `useFeatureService` instead of `useService` for lazy-loaded features.

```typescript
// ❌ Fails if feature not loaded
const service = useService<UserRepository>(UserTypes.UserRepository);

// ✅ Loads feature automatically
const { service, isLoading } = useFeatureService<UserRepository>(
  'user',
  UserTypes.UserRepository
);
```

### Cache Issues

```bash
# Nuclear option - clean everything
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

## Documentation

- **[TASK_COMPLETE.md](TASK_COMPLETE.md)** - Enhanced notifications feature
- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Dynamic features implementation
- **[DYNAMIC_FEATURES_COMPLETE_EXAMPLES.md](DYNAMIC_FEATURES_COMPLETE_EXAMPLES.md)** - 6 complete examples
- **[src/core/di/README.md](src/core/di/README.md)** - DI system details

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Mobile framework |
| TypeScript | Type safety |
| InversifyJS | Dependency injection |
| React Navigation | Navigation |
| Axios | HTTP client |

## Features Overview

### Auth Feature
- Login screen with validation
- Mock authentication
- Secure navigation flow

### User Feature
- Profile display
- Contact information
- Pull-to-refresh
- **Cross-feature demo**: Send notification button

### Admin Feature
- Dashboard with statistics
- Activity feed
- Pull-to-refresh

### Chat Feature
- Message list
- Bot responses
- Real-time updates

### Notifications Feature (Example)
- 3-screen navigation (List/Detail/Settings)
- 7 notification types with colors
- Rich data models
- User association
- Metadata support

## Adding Your Own Feature

```typescript
// 1. Create feature directory
mkdir -p src/features/myfeature/{di,models,services,ui}

// 2. Create DI module (myfeature.module.ts)
export const MyFeatureModule: FeatureModule = {
  name: 'myfeature',
  register: (container) => {
    container.bind(MyFeatureTypes.MyService)
      .to(MyService)
      .inSingletonScope();
  },
};

// 3. Self-register (index.ts)
featureRegistry.register({
  name: 'myfeature',
  description: 'My awesome feature',
  loader: async () => import('./di/myfeature.module'),
});

// 4. Import in App.tsx
import './features/myfeature';

// Done! Use anywhere:
const { service } = useFeatureService('myfeature', MyFeatureTypes.MyService);
```

## License

MIT

---

**Architecture**: Feature-Based MVVM with Dynamic DI  
**Status**: Production Ready  
**React Native**: 0.76+
