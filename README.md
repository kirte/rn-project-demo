# rn-project-demo

React Native CLI starter (TypeScript) with:
- **Decentralized Dependency Injection** (Inversify-style with feature-specific DI containers)
- Axios ApiService + ApiResult sealed-type wrapper
- **Feature-based architecture** with isolated DI configuration per feature
- Named bindings, interceptors skeleton, and example features (User, Auth, Admin, Chat)
- Auto-generated architecture diagrams under `docs/architecture/`
- Demo API: https://jsonplaceholder.typicode.com

## Architecture Highlights

✨ **Decentralized DI System** - Each feature has its own DI types and container registration  
✨ **Feature Isolation** - Features are self-contained and can be easily added/removed  
✨ **Scalable** - No central bottleneck for DI type definitions  
✨ **Type-Safe** - Full TypeScript support with discriminated union types for API results

## Quickstart (npm)

1. Create RN CLI project (if you haven't already, to generate native folders):
```bash
npx react-native init rn-project-demo --template react-native-template-typescript
cd rn-project-demo
```

2. Unzip this template into your project root (overwrite the `src/`, `.github/`, etc).

3. Install dependencies:
```bash
npm install
```

4. (Optional) Run mock server for admin/auth endpoints:
```bash
npm run mock-server
```

5. Start Metro and run the app:
```bash
npm start
npm run android   # or npm run ios
```

## Project layout (important files)
```
src/
  core/
    api/               # AxiosApiService, ApiResult, interceptors
    di/
      container.ts     # Core DI container (imports feature containers)
      types.ts         # Core infrastructure types (CoreTypes)
    auth/              # AuthService (cross-cutting concern)
    hooks/             # useService hook for React integration
  features/
    user/
      di/
        types.ts       # UserTypes (feature-specific)
        container.ts   # User feature DI registration
      UserRepository.ts
      UserModel.ts
      UserScreen.tsx
    admin/
      di/
        types.ts       # AdminTypes (feature-specific)
        container.ts   # Admin feature DI registration
      AdminRepository.ts
      AdminScreen.tsx
    auth/
      di/
        types.ts       # AuthTypes (feature-specific)
        container.ts   # Auth feature DI registration
      AuthRepository.ts
      LoginScreen.tsx
    chat/
      di/
        types.ts       # ChatTypes (feature-specific)
        container.ts   # Chat feature DI registration
      ChatSessionService.ts
docs/
  architecture/
    high-level-architecture.svg
    module-di-diagram.svg
    data-flow.svg
mock-server/           # Optional express mock server for auth/admin endpoints
README.md
.gitignore
.github/workflows/ci.yml
jest.config.js
tsconfig.json
package.json
```

## Diagrams

See `docs/architecture/*.svg` for visual diagrams:
- `high-level-architecture.svg` — overall app layers
- `module-di-diagram.svg` — DI container & modules
- `data-flow.svg` — API request/response flow with token refresh

These are SVG files included in the repo and ready to view on GitHub.

## Dependency Injection Architecture

### Decentralized Feature-Based DI

Each feature maintains its own DI configuration:

**Core Types** (`src/core/di/types.ts`):
```typescript
export const CoreTypes = {
  ApiService: Symbol.for('ApiService'),
  AuthService: Symbol.for('AuthService'),
};
```

**Feature Types** (e.g., `src/features/user/di/types.ts`):
```typescript
export const UserTypes = {
  UserRepository: Symbol.for('UserRepository'),
};
```

**Feature Registration** (e.g., `src/features/user/di/container.ts`):
```typescript
import { container } from '../../../core/di/container';
import { UserTypes } from './types';
import { UserRepository } from '../UserRepository';

container.bind(UserTypes.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
```

### Usage in Components

```typescript
import { useService } from '../../core/hooks/useService';
import { UserTypes } from './di/types';

const userRepo = useService<UserRepository>(UserTypes.UserRepository);
```

### Benefits

- ✅ **Feature Isolation** - Each feature is self-contained
- ✅ **No Merge Conflicts** - No central types file bottleneck
- ✅ **Easy to Remove** - Delete feature folder, remove import
- ✅ **Lazy Loading** - Can dynamically import feature containers
- ✅ **Team Scalability** - Multiple teams work independently

## Tests

Run unit tests:
```bash
npm test
```

---
