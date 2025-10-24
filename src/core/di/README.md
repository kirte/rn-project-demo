# Dependency Injection Container

## Lazy Loading Architecture

This DI container uses a **lazy loading** pattern to minimize app startup overhead.

### How It Works

1. **Core Container Initialization** (`src/core/di/container.ts`)
   - Creates the container immediately
   - Registers only CORE services (ApiService, AuthService)
   - Does NOT import feature containers

2. **Feature-Level Lazy Registration**
   - Each feature's `navigation/navigation.tsx` imports its `di/container.ts` as the FIRST import
   - Feature dependencies are registered ONLY when the navigator is first imported
   - Uses `isBound()` check to prevent duplicate registrations

### Critical Import Order

**⚠️ IMPORTANT:** Each feature's navigator MUST import its DI container first:

```typescript
// ✅ CORRECT - DI container imported FIRST
import '../di/container';  // This registers dependencies

import React from 'react';
import { UserScreen } from '../ui/UserScreen';

export const UserNavigator = () => { /* ... */ };
```

```typescript
// ❌ WRONG - Screen imported before DI container
import React from 'react';
import { UserScreen } from '../ui/UserScreen';  // UserScreen uses container!

import '../di/container';  // Too late! Container not ready yet

export const UserNavigator = () => { /* ... */ };
```

### Benefits

✅ **Faster App Startup** - Only core services load at startup  
✅ **On-Demand Loading** - Features load when first used  
✅ **Memory Efficient** - Unused features don't consume memory  
✅ **Scalable** - Add features without impacting startup time  

### Example Flow

```
App Start → Core DI Container Created → Only ApiService & AuthService registered
                                      ↓
User Opens Auth Screen → imports AuthNavigator → navigation.tsx imports di/container
                                      ↓
                        auth/di/container.ts executes → AuthRepository registered
                                      ↓
                        LoginScreen renders → useService works! ✅
```

### Adding a New Feature

1. Create your feature's DI container with lazy check:
```typescript
// src/features/myfeature/di/container.ts
import { container } from '../../../core/di/container';
import { MyFeatureTypes } from './types';
import { MyRepository } from '../repositories/MyRepository';

if (!container.isBound(MyFeatureTypes.MyRepository)) {
    container.bind(MyFeatureTypes.MyRepository)
        .to(MyRepository)
        .inSingletonScope();
}

export { MyFeatureTypes };
```

2. Import it FIRST in your navigator:
```typescript
// src/features/myfeature/navigation/navigation.tsx
import '../di/container';  // ⚠️ MUST BE FIRST!

import React from 'react';
import { MyScreen } from '../ui/MyScreen';

export const MyNavigator = () => { /* ... */ };
```

3. Export from feature index:
```typescript
// src/features/myfeature/index.ts
export { MyNavigator } from './navigation/navigation';
```

That's it! Your feature will register lazily when the navigator is first imported.

