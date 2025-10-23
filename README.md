# rn-project-demo

React Native CLI starter (TypeScript) with:
- Dependency Injection (Inversify-style service locator)
- Axios ApiService + ApiResult sealed-type wrapper
- Named bindings, interceptors skeleton, and example features (User, Auth, Admin, Chat)
- Auto-generated architecture diagrams under `docs/architecture/`
- Demo API: https://jsonplaceholder.typicode.com

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
    di/                # container and DI types
    auth/              # AuthService
    hooks/             # useService hook
  features/
    auth/              # AuthRepository, LoginScreen
    user/              # UserRepository, UserScreen
    admin/             # AdminRepository, AdminScreen
    chat/              # ChatSessionService example
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

## Tests

Run unit tests:
```bash
npm test
```

---
