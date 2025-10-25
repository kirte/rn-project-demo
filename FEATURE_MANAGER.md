# Feature Manager Documentation

## 📖 Complete Documentation Index

This app implements a **Feature Manager** system that enables calling APIs from features that haven't been loaded yet.

### Documentation Files

1. **[README.md](README.md)** - Main project documentation
   - Quick start guide
   - Architecture overview
   - Feature Manager usage section
   - API patterns
   - Development commands

2. **[ARCHITECTURE_SUMMARY.md](ARCHITECTURE_SUMMARY.md)** - Detailed architecture
   - MVVM pattern explanation
   - Dependency injection deep dive
   - Feature-based structure
   - Navigation flow

3. **[src/core/di/README.md](src/core/di/README.md)** - DI System documentation
   - Core vs Feature containers
   - Manual DI rationale
   - Usage patterns
   - Troubleshooting

4. **[CROSS_FEATURE_API_EXAMPLE.md](CROSS_FEATURE_API_EXAMPLE.md)** - Practical examples
   - Three different patterns for cross-feature calls
   - Code examples
   - When to use each pattern

## 🚀 Quick Reference

### Call API from Unloaded Feature

```typescript
// In React Component
const { service: userRepo, isLoading, error } = useFeatureService<UserRepository>(
  'user',
  UserTypes.UserRepository
);

// In Service/Utility
await ensureFeatureLoaded('user');
const userRepo = container.get<UserRepository>(UserTypes.UserRepository);

// Preload Multiple Features
await preloadFeatures(['user', 'admin', 'chat']);
```

### Feature Module Structure

Each feature has a `*.module.ts` file:

```typescript
// src/features/user/di/user.module.ts
export function registerUserModule(container: Container): void {
  container.bind(UserTypes.UserRepository)
    .toDynamicValue((context) => {
      const apiService = context.container.get(CoreTypes.ApiService);
      return new UserRepository(apiService);
    })
    .inSingletonScope();
}
```

### Feature Manager API

```typescript
// Load single feature
await ensureFeatureLoaded('user');

// Check if loaded
isFeatureLoaded('user'); // boolean

// Preload multiple
await preloadFeatures(['user', 'admin']);

// Get loaded list
getLoadedFeatures(); // ['user', 'admin']
```

## 🎯 Key Concepts

### Problem Solved

**Before**: All features had to be registered at startup → Slow app startup

**After**: Features load on-demand → Fast startup, features load when needed

### How It Works

```
1. App starts → Only core services loaded
2. Navigate to feature → Feature module registers
3. Cross-feature call → Feature auto-loads if needed
4. Subsequent calls → Instant (already loaded)
```

### Benefits

- ✅ **Fast Startup** - Only core services at startup
- ✅ **Lazy Loading** - Features load when first accessed
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **No Duplication** - Features register once
- ✅ **Race-Safe** - Concurrent loads handled correctly

## 📚 Learn More

- See [CROSS_FEATURE_API_EXAMPLE.md](CROSS_FEATURE_API_EXAMPLE.md) for complete examples
- See [src/core/di/README.md](src/core/di/README.md) for DI internals
- See [src/core/di/featureManager.ts](src/core/di/featureManager.ts) for implementation

---

**Created**: 2024  
**Architecture**: Feature-based MVVM with Lazy Loading DI

