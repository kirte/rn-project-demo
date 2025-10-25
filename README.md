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

### Step-by-Step Guide

#### Step 1: Create Feature Structure

```bash
mkdir -p src/features/products/{di,models,services,repositories,ui,navigation,viewmodels}
```

#### Step 2: Create DI Types

```typescript
// src/features/products/di/types.ts
export const ProductTypes = {
  ProductRepository: Symbol.for('ProductRepository'),
  ProductService: Symbol.for('ProductService'),
} as const;
```

#### Step 3: Create Models

```typescript
// src/features/products/models/ProductModel.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

#### Step 4: Create Repository

```typescript
// src/features/products/repositories/ProductRepository.ts
import { injectable } from 'inversify';
import { ApiService } from '../../../core/api/ApiService';
import { ApiResult } from '../../../core/api/ApiResult';
import { Product } from '../models/ProductModel';

export class ProductRepository {
  constructor(private api: ApiService) {}

  async getProducts(): Promise<ApiResult<Product[]>> {
    return this.api.get<Product[]>('/products');
  }

  async getProduct(id: number): Promise<ApiResult<Product>> {
    return this.api.get<Product>(`/products/${id}`);
  }
}
```

#### Step 5: Create Service (Optional - if needed)

```typescript
// src/features/products/services/ProductService.ts
import { injectable } from 'inversify';
import { Product } from '../models/ProductModel';

@injectable()
export class ProductService {
  private cart: Product[] = [];

  addToCart(product: Product): void {
    this.cart.push(product);
  }

  getCart(): Product[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }
}
```

#### Step 6: Create ViewModel

```typescript
// src/features/products/viewmodels/ProductViewModel.ts
import { useState, useEffect } from 'react';
import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../models/ProductModel';

export const useProductViewModel = (repository: ProductRepository) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await repository.getProducts();
    
    if (result.success) {
      setProducts(result.data);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refresh: loadProducts,
  };
};
```

#### Step 7: Create UI Screens

```typescript
// src/features/products/ui/ProductListScreen.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useService } from '../../../core/hooks/useService';
import { ProductTypes } from '../di/types';
import { ProductRepository } from '../repositories/ProductRepository';
import { useProductViewModel } from '../viewmodels/ProductViewModel';

export const ProductListScreen = () => {
  const repository = useService<ProductRepository>(ProductTypes.ProductRepository);
  const viewModel = useProductViewModel(repository);

  if (viewModel.isLoading) {
    return <ActivityIndicator />;
  }

  if (viewModel.error) {
    return <Text>Error: {viewModel.error}</Text>;
  }

  return (
    <FlatList
      data={viewModel.products}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  item: { padding: 16, borderBottomWidth: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
});
```

```typescript
// src/features/products/ui/ProductDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Product Detail: {productId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

#### Step 8: Create Navigation

```typescript
// src/features/products/navigation/navigation.tsx
import { registerProductModule } from '../di/product.module';
import { container } from '../../../core/di/container';

// Register module when navigator is imported
registerProductModule(container);

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductListScreen } from '../ui/ProductListScreen';
import { ProductDetailScreen } from '../ui/ProductDetailScreen';

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
};

const Stack = createNativeStackNavigator<ProductStackParamList>();

export const ProductNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

export const ProductRoutes = {
  ProductList: 'ProductList',
  ProductDetail: 'ProductDetail',
} as const;
```

#### Step 9: Create DI Module

```typescript
// src/features/products/di/product.module.ts
import { Container } from 'inversify';
import { FeatureModule } from '../../../core/di/featureRegistry';
import { ProductTypes } from './types';
import { ProductRepository } from '../repositories/ProductRepository';
import { ProductService } from '../services/ProductService';
import { CoreTypes } from '../../../core/di/types';

let isRegistered = false;

function registerProductModule(container: Container): void {
  if (isRegistered) {
    console.log('[ProductModule] Already registered, skipping');
    return;
  }

  // Register ProductRepository with ApiService dependency
  if (!container.isBound(ProductTypes.ProductRepository)) {
    container.bind(ProductTypes.ProductRepository)
      .toDynamicValue((context) => {
        const apiService = context.container.get(CoreTypes.ApiService);
        return new ProductRepository(apiService);
      })
      .inSingletonScope();
  }

  // Register ProductService (no dependencies)
  if (!container.isBound(ProductTypes.ProductService)) {
    container.bind(ProductTypes.ProductService)
      .to(ProductService)
      .inSingletonScope();
  }

  isRegistered = true;
  console.log('[ProductModule] ✅ Registered successfully');
}

export const ProductFeatureModule: FeatureModule = {
  name: 'products',
  register: registerProductModule,
};

export { registerProductModule, ProductTypes };
```

#### Step 10: Create Feature Entry Point (Self-Registration)

```typescript
// src/features/products/index.ts
import { featureRegistry } from '../../core/di/featureRegistry';

// Self-register this feature
featureRegistry.register({
  name: 'products',
  description: 'Product catalog and shopping',
  version: '1.0.0',
  loader: async () => {
    const module = await import('./di/product.module');
    return module.ProductFeatureModule;
  },
  dependencies: ['auth'], // Optional: depends on auth
  tags: ['shopping', 'catalog'],
});

// Export public API
export { ProductTypes } from './di/types';
export { ProductRepository } from './repositories/ProductRepository';
export { ProductService } from './services/ProductService';
export type { Product } from './models/ProductModel';
export { ProductListScreen } from './ui/ProductListScreen';
export { ProductDetailScreen } from './ui/ProductDetailScreen';
export { ProductNavigator, ProductRoutes } from './navigation/navigation';
export type { ProductStackParamList } from './navigation/navigation';
```

#### Step 11: Import Feature in App.tsx

```typescript
// src/App.tsx
import './core/di/container';

import './features/auth';
import './features/user';
import './features/admin';
import './features/chat';
import './features/notifications';
import './features/products';  // ✅ Add this line

import React from 'react';
import { AppNavigation } from './navigation';

export default function App() {
  return <AppNavigation />;
}
```

#### Step 12: Add to Navigation (Optional)

```typescript
// src/navigation/RootNavigator.tsx
import { ProductNavigator } from '../features/products';

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="UserTab" component={UserNavigator} />
    <Tab.Screen name="AdminTab" component={AdminNavigator} />
    <Tab.Screen name="ChatTab" component={ChatScreen} />
    <Tab.Screen name="NotificationsTab" component={NotificationNavigator} />
    {/* ✅ Add products tab */}
    <Tab.Screen 
      name="ProductsTab" 
      component={ProductNavigator}
      options={{ title: 'Products' }}
    />
  </Tab.Navigator>
);
```

### Done! 🎉

Your feature is now:
- ✅ Self-registered and discoverable
- ✅ Lazy-loaded on first access
- ✅ Has proper DI setup
- ✅ Has navigation stack
- ✅ Has ViewModels for business logic
- ✅ Has type-safe API calls
- ✅ Can be called from other features

### Use from Another Feature

```typescript
// Call products API from any other feature
const { service: productRepo, isLoading } = useFeatureService<ProductRepository>(
  'products',
  ProductTypes.ProductRepository
);

if (!isLoading) {
  const result = await productRepo.getProducts();
}
```

### Feature Checklist

- [ ] Created folder structure
- [ ] Defined DI types
- [ ] Created models
- [ ] Created repository with API calls
- [ ] Created service (if needed)
- [ ] Created ViewModels
- [ ] Created UI screens
- [ ] Created navigation stack
- [ ] Created DI module
- [ ] Self-registered in index.ts
- [ ] Imported in App.tsx
- [ ] Added to main navigation (if needed)
- [ ] Tested feature loading
- [ ] Tested cross-feature calls

## License

MIT

---

**Architecture**: Feature-Based MVVM with Dynamic DI  
**Status**: Production Ready  
**React Native**: 0.76+
