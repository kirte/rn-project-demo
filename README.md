# React Native MVVM Demo

A modern React Native application showcasing **feature-based architecture** with **MVVM pattern**, **manual dependency injection**, and **login-first navigation**.

Built with **React Native**, **TypeScript**, **InversifyJS**, and **React Navigation**.

---

## ✨ Features

- ✨ **MVVM Architecture** - ViewModels as React hooks for clean separation of concerns
- ✨ **Feature-Based Structure** - Modular, scalable, and team-friendly
- ✨ **Manual Dependency Injection** - React Native compatible DI with InversifyJS
- ✨ **Login-First Navigation** - Secure authentication flow before app access
- ✨ **Modern UI/UX** - Pull-to-refresh, loading states, error handling
- ✨ **Type-Safe API Layer** - ApiResult pattern for robust error handling
- ✨ **Lazy Loading** - Features load on-demand for fast startup

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Install dependencies
npm install

# Clear Metro cache (important after DI changes)
npx react-native start --reset-cache

# In a new terminal, run on your platform
npx react-native run-android
# or
npx react-native run-ios
```

### First Run

1. **Login Screen**: Enter any username/password (demo mode)
2. **Explore Features**: Navigate between Profile, Dashboard, and Chat tabs
3. **Try Interactions**: Pull-to-refresh, send chat messages, test error states

---

## 📁 Project Structure

```
src/
├── core/
│   ├── api/              # AxiosApiService, ApiResult wrapper
│   │   ├── ApiService.ts         # API interface
│   │   ├── AxiosApiService.ts    # Axios implementation
│   │   └── ApiResult.ts          # Type-safe result wrapper
│   ├── auth/             # Core authentication service
│   │   └── AuthService.ts
│   ├── di/               # Dependency injection container
│   │   ├── container.ts          # Main DI container
│   │   └── types.ts              # Core DI type symbols
│   └── hooks/            # Shared React hooks
│       └── useService.ts         # DI integration hook
│
├── features/
│   ├── auth/
│   │   ├── di/                   # Auth-specific DI types & registration
│   │   ├── viewmodels/           # LoginViewModel
│   │   ├── ui/                   # LoginScreen
│   │   ├── repositories/         # AuthRepository
│   │   └── index.ts              # Feature public API
│   │
│   ├── user/
│   │   ├── di/                   # User-specific DI types & registration
│   │   ├── viewmodels/           # UserViewModel
│   │   ├── ui/                   # UserScreen
│   │   ├── repositories/         # UserRepository
│   │   ├── models/               # User data models
│   │   ├── navigation/           # User feature navigation
│   │   └── index.ts              # Feature public API
│   │
│   ├── admin/
│   │   ├── di/                   # Admin-specific DI
│   │   ├── viewmodels/           # AdminViewModel
│   │   ├── ui/                   # AdminScreen
│   │   ├── repositories/         # AdminRepository
│   │   ├── navigation/           # Admin navigation
│   │   └── index.ts
│   │
│   └── chat/
│       ├── di/                   # Chat-specific DI
│       ├── viewmodels/           # ChatViewModel
│       ├── ui/                   # ChatScreen
│       ├── services/             # Chat business logic
│       └── index.ts
│
└── navigation/
    ├── RootNavigator.tsx         # Login → MainTabs navigation
    └── index.ts                  # Navigation exports

App.tsx                           # Root component
index.js                          # App entry point (imports reflect-metadata)
```

---

## 🏗️ Architecture Overview

> 📖 **For detailed architecture documentation, see [ARCHITECTURE_SUMMARY.md](ARCHITECTURE_SUMMARY.md)**

### Data Flow

```
User Action → View → ViewModel → Repository → API Service → Backend
     ↑                                                             ↓
     └──────────────── Response Flow ←──────────────────────────────┘
```

### MVVM Pattern

Our implementation uses **ViewModels as React hooks** to separate business logic from UI:

```typescript
// UI Layer (View) - Renders UI based on ViewModel state
const UserScreen = () => {
  const userRepo = useService<UserRepository>(UserTypes.UserRepository);
  const viewModel = useUserViewModel(userRepo);
  
  return (
    <View>
      {viewModel.isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text>{viewModel.user?.name}</Text>
      )}
    </View>
  );
};

// ViewModel Layer (Business Logic) - Manages state and orchestrates data flow
export const useUserViewModel = (userRepository: UserRepository) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadUser = async () => {
    setIsLoading(true);
    const result = await userRepository.getUser(1);
    
    if (result.success) {
      setUser(result.data);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => { loadUser(); }, []);
  
  return { user, isLoading, error, refresh: loadUser };
};

// Repository Layer (Data Access) - Abstracts API calls
export class UserRepository {
  constructor(private api: ApiService) {}
  
  async getUser(id: number): Promise<ApiResult<User>> {
    return this.api.get<User>(`/users/${id}`);
  }
}
```

**Benefits:**
- ✅ **Testable** - Business logic isolated from React components
- ✅ **Reusable** - ViewModels can be shared across screens
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Type-safe** - Full TypeScript support throughout

---

## 💉 Dependency Injection

### Why Manual DI?

> ⚠️ **React Native Limitation**: Babel doesn't support TypeScript's `emitDecoratorMetadata` properly. Traditional `@inject` decorators don't work reliably.
>
> **Our Solution**: Manual injection using `toDynamicValue()` for explicit, reliable dependency management.

### Core Container Setup

```typescript
// src/core/di/container.ts
import { Container } from 'inversify';
import { CoreTypes } from './types';
import { ApiService } from '../api/ApiService';
import { AxiosApiService } from '../api/AxiosApiService';
import { AuthService } from '../auth/AuthService';

const container = new Container();

// Export container FIRST to allow feature modules to import it
export { container, CoreTypes };

// Register core services
container.bind<ApiService>(CoreTypes.ApiService)
  .toDynamicValue(() => new AxiosApiService('https://jsonplaceholder.typicode.com'))
  .inSingletonScope();

container.bind<AuthService>(CoreTypes.AuthService)
  .to(AuthService)
  .inSingletonScope();
```

### Feature Container Setup (Lazy Loading)

```typescript
// src/features/user/di/container.ts
import { container } from '../../../core/di/container';
import { UserTypes } from './types';
import { UserRepository } from '../repositories/UserRepository';
import { CoreTypes } from '../../../core/di/types';

// Lazy registration - only happens when this feature is imported
if (!container.isBound(UserTypes.UserRepository)) {
    container.bind(UserTypes.UserRepository)
        .toDynamicValue((context) => {
            // Manually inject ApiService dependency
            const apiService = context.container.get(CoreTypes.ApiService);
            return new UserRepository(apiService);
        })
        .inSingletonScope();
}

export { UserTypes };
```

### Using Services in Components

```typescript
import { useService } from '../../core/hooks/useService';
import { UserTypes } from './di/types';
import { UserRepository } from './repositories/UserRepository';

const UserScreen = () => {
  // Retrieve service from DI container
  const userRepo = useService<UserRepository>(UserTypes.UserRepository);
  const viewModel = useUserViewModel(userRepo);
  
  // Use viewModel in UI...
};
```

### DI Benefits

- ✅ **Lazy Loading** - Features load dependencies on-demand
- ✅ **Fast Startup** - Only core services registered at startup
- ✅ **Testable** - Easy to mock dependencies in tests
- ✅ **Maintainable** - Centralized dependency configuration
- ✅ **Type-Safe** - Full TypeScript inference

---

## 🌐 API Calling Pattern

### ApiResult Sealed Type

We use a **discriminated union** for type-safe error handling without exceptions:

```typescript
// Success case
type Success<T> = { 
  success: true; 
  data: T; 
};

// Failure case
type Failure = { 
  success: false; 
  error: string; 
};

// Combined sealed type
export type ApiResult<T> = Success<T> | Failure;
```

### Usage in Repository

```typescript
import { ApiService } from '../../../core/api/ApiService';
import { ApiResult } from '../../../core/api/ApiResult';
import { User } from '../models/User';

export class UserRepository {
  constructor(private api: ApiService) {}
  
  async getUser(id: number): Promise<ApiResult<User>> {
    return this.api.get<User>(`/users/${id}`);
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<ApiResult<User>> {
    return this.api.put<User>(`/users/${id}`, data);
  }
}
```

### Usage in ViewModel

```typescript
const loadUser = async () => {
  setIsLoading(true);
  const result = await userRepository.getUser(1);
  
  // TypeScript narrows the type based on success property
  if (result.success) {
    setUser(result.data);        // TypeScript knows data exists
    setError(null);
  } else {
    setError(result.error);      // TypeScript knows error exists
  }
  
  setIsLoading(false);
};
```

**Benefits:**
- ✅ **Type-Safe** - No unsafe type casts or try-catch blocks
- ✅ **Explicit** - Forces developers to handle both success and error cases
- ✅ **Clean** - No exceptions thrown across boundaries
- ✅ **Predictable** - Always returns a result object

---

## 🧭 Navigation Structure

### Login-First Pattern

```
App Entry (index.js)
    ↓
App.tsx (NavigationContainer)
    ↓
Stack Navigator (RootNavigator)
├─ Login Screen (initial route)
│   └─ [After authentication]
│       ↓
└─ Main Tabs Navigator
    ├─ Profile Tab (UserNavigator)
    ├─ Dashboard Tab (AdminNavigator)
    └─ Chat Tab (ChatScreen)
```

### Implementation

```typescript
// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../features/auth/ui/LoginScreen';
import { UserNavigator } from '../features/user';
import { AdminNavigator } from '../features/admin';
import { ChatScreen } from '../features/chat';

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

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="UserTab" component={UserNavigator} options={{ title: 'Profile' }} />
    <Tab.Screen name="AdminTab" component={AdminNavigator} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="ChatTab" component={ChatScreen} options={{ title: 'Chat' }} />
  </Tab.Navigator>
);

export const RootNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
  </Stack.Navigator>
);
```

---

## 🎯 Key Technical Decisions

### 1. Manual DI Instead of Decorators

**Reason**: React Native's Babel doesn't support `emitDecoratorMetadata` from TypeScript.  
**Impact**: Slightly more verbose but reliable and predictable across platforms.

### 2. ViewModels as React Hooks

**Reason**: Leverage React's built-in state management and hooks system.  
**Impact**: Natural integration with React components, reusable, testable.

### 3. Feature-Based Structure

**Reason**: Scalability and team independence - multiple teams can work on different features.  
**Impact**: Easy to add/remove features, clear ownership boundaries.

### 4. Lazy Loading of Dependencies

**Reason**: Avoid registering all dependencies at app startup.  
**Impact**: Faster initial load time, features register on-demand.

### 5. ApiResult Pattern

**Reason**: Type-safe error handling without exceptions.  
**Impact**: Forces explicit error handling, prevents runtime crashes.

### 6. Login-First Navigation

**Reason**: Better UX and security - users must authenticate before accessing features.  
**Impact**: Clear user journey, protected routes.

---

## 🛠️ Development Commands

### Basic Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

### Cache Management

```bash
# Clear Metro cache (recommended after pulling changes or modifying DI)
npx react-native start --reset-cache

# Clear all caches
npx react-native start --reset-cache
rm -rf node_modules/.cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Complete clean rebuild (nuclear option)
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

### Production Builds

```bash
# Android release build
npx react-native run-android --variant=release

# iOS release build
npx react-native run-ios --configuration=Release
```

---

## 🐛 Troubleshooting

### DI Container Errors

**Error**: `TypeError: Cannot read property 'get' of undefined`

**Solutions**:
1. Ensure `reflect-metadata` is imported **first** in `index.js`
2. Check that feature DI containers are imported before screen components
3. Verify module loading order in feature `navigation/navigation.tsx` files
4. Clear Metro cache: `npx react-native start --reset-cache`

**Error**: `Service type X is not registered in the DI container`

**Solutions**:
1. Ensure the feature's DI container file is imported
2. Check that the feature's `index.ts` exports the navigator (which imports DI)
3. Verify lazy registration has `if (!container.isBound(...))` check

### API Errors

**Error**: `request failed` or network errors

**Solutions**:
1. Verify internet connectivity on device/simulator
2. Check API endpoint URLs in repositories
3. For Android: Ensure `android:usesCleartextTraffic="true"` in AndroidManifest.xml
4. Mock API used: https://jsonplaceholder.typicode.com

### Build Errors

**Error**: Metro bundler issues or module resolution errors

**Solutions**:
1. Clear Metro cache: `npx react-native start --reset-cache`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clean native builds (see Cache Management section)
4. Restart Metro bundler

---

## 📖 Documentation

- 📖 **[Architecture Details](ARCHITECTURE_SUMMARY.md)** - Complete architecture explanation with diagrams
- 🔧 **[Import Fixes History](IMPORT_FIXES_COMPLETE.md)** - DI setup troubleshooting and solutions

---

## 🔧 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React Native | Cross-platform mobile development |
| **Language** | TypeScript | Type safety and developer experience |
| **DI** | InversifyJS | Dependency injection container |
| **Navigation** | React Navigation v6 | Navigation and routing |
| **HTTP Client** | Axios | API communication |
| **State** | React Hooks | Component state management |
| **Mock API** | JSONPlaceholder | Demo backend for testing |

---

## 📚 Feature Modules

### Auth Feature (`src/features/auth/`)
- **Purpose**: User authentication and login
- **Screens**: LoginScreen
- **Services**: AuthService, AuthRepository
- **State**: LoginViewModel

### User Feature (`src/features/user/`)
- **Purpose**: User profile and personal information
- **Screens**: UserScreen
- **Services**: UserRepository
- **State**: UserViewModel
- **Features**: Profile display, contact info, pull-to-refresh

### Admin Feature (`src/features/admin/`)
- **Purpose**: Dashboard and administrative functions
- **Screens**: AdminScreen
- **Services**: AdminRepository
- **State**: AdminViewModel
- **Features**: Statistics cards, activity feed, pull-to-refresh

### Chat Feature (`src/features/chat/`)
- **Purpose**: Interactive messaging
- **Screens**: ChatScreen
- **Services**: ChatSessionService
- **State**: ChatViewModel
- **Features**: Message list, bot responses, real-time updates

---

## 🎨 UI/UX Features

- **Modern Design**: Clean, card-based layouts with consistent spacing
- **Pull-to-Refresh**: Standard mobile pattern on all list screens
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages with retry options
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Semantic structure and proper contrast ratios

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Testable Architecture

Our MVVM + DI architecture makes testing straightforward:

```typescript
// Testing a ViewModel
const mockRepository = {
  getUser: jest.fn().mockResolvedValue({
    success: true,
    data: { id: 1, name: 'Test User' }
  })
};

const { result } = renderHook(() => useUserViewModel(mockRepository));
// Assert on result.current...
```

---

## 🤝 Contributing

### Adding a New Feature

1. **Create feature directory**: `src/features/myfeature/`
2. **Set up DI**: Create `di/types.ts` and `di/container.ts`
3. **Add repositories**: Create data access layer
4. **Create ViewModels**: Add business logic as hooks
5. **Build UI**: Create screen components
6. **Export public API**: Update feature `index.ts`
7. **Add to navigation**: Update `RootNavigator.tsx`

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Keep ViewModels pure (business logic only)
- Use functional components with hooks
- Document complex logic with comments

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- React Native community
- InversifyJS team
- React Navigation team
- JSONPlaceholder for mock API

---

**Built with ❤️ using React Native**

*Architecture: Feature-based MVVM with Dependency Injection*  
*Platform: React Native 0.76*  
*Created: 2024*
