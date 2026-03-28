# API Auth Middleware Design

## Goal

Remove repeated session checks from protected REST-style route handlers by enforcing authentication in a shared middleware layer.

The scope is intentionally narrow: apply this only to the protected todo REST handlers in `src/routes/api/todos/index.ts` and `src/routes/api/todos/$id.ts`, not to server functions, page-level route guards, or `src/routes/api/auth/$`.

## Current State

- `src/middleware/auth-restful.middleware.ts` already provides REST-specific auth middleware that reads the request session, returns `401`, and injects `session` and `user` into middleware context.
- `src/middleware/auth-fn.middleware.ts` separately handles server function authentication.
- `src/routes/api/todos/index.ts` and `src/routes/api/todos/$id.ts` still call `requireSessionFromRequest(request)` inside every handler.
- Each handler repeats the same `401 Unauthorized` branch before reaching actual todo logic.

## Recommended Approach

Use the existing REST middleware as the single authentication entry point for the protected todo REST handlers in this pass.

Each protected REST route should attach `authRouteMiddleware` in its server configuration. After that, handlers should read the authenticated user from middleware context instead of manually loading the session from the request.

This keeps authentication policy centralized while letting handlers focus on validation, persistence, and response shaping.

## Alternatives Considered

### 1. Route-level REST middleware

Recommended. Uses an abstraction the project already has, removes the most duplication, and keeps HTTP concerns in the routing layer where they belong.

### 2. Higher-order handler wrapper such as `withApiAuth`

Would reduce some duplication, but each handler still needs to be wrapped manually. It is cleaner than inline checks, but less native than using the existing middleware mechanism.

### 3. Service-layer authentication

Would push request-derived auth concerns into business services, which blurs boundaries and makes service APIs less reusable.

## Design Details

### Middleware Behavior

- Keep `src/middleware/auth-restful.middleware.ts` as the REST-only auth primitive.
- Preserve current behavior:
  - load session from request headers
  - return JSON `401` when no session exists
  - inject `session` and `user` into middleware context when authenticated
- Standardize the unauthorized payload to `{ error: 'Unauthorized' }` so the middleware matches the existing todo route contract.

### Route Integration

- Update `src/routes/api/todos/index.ts` to register `authRouteMiddleware` at the route server level.
- Update `src/routes/api/todos/$id.ts` the same way.
- Remove direct imports of `requireSessionFromRequest` from these route files.
- Handlers should consume the authenticated identity from middleware context, using `user.id` for todo ownership checks and mutations.

### Handler Responsibilities After Refactor

- `GET /api/todos/`: fetch todos for the authenticated user.
- `POST /api/todos/`: validate request body, then create a todo for the authenticated user.
- `GET /api/todos/$id`: validate params, then fetch the requested todo for the authenticated user.
- `PATCH /api/todos/$id`: validate params and body, then update the authenticated user's todo.
- `DELETE /api/todos/$id`: validate params, then delete the authenticated user's todo.

In all cases, the route should assume authentication has already happened before the handler runs.

### Boundaries

- Do not merge REST middleware and server-function middleware in this pass.
- Do not move auth into `TodoService`.
- Do not broaden the refactor beyond the two todo REST route files touched here.

## Error Handling

- Unauthenticated requests should terminate in REST middleware with `401` JSON.
- Validation failures remain in handlers as `400` responses.
- Missing resources remain `404` responses.
- Unexpected auth-related branching inside handlers should be removed once the middleware is attached.
- Parameter validation behavior is out of scope for this refactor: if `TodoIdParamSchema.parse(params)` currently throws through the framework error path, leave that behavior unchanged rather than reshaping it into a new explicit `400` contract.

## Testing

- Update tests or add focused coverage so protected REST endpoints are verified through middleware-backed auth rather than inline session checks.
- Run the relevant test suite for auth helpers and route behavior.
- At minimum, verify the project still builds and that authenticated todo API operations compile with the new middleware context usage.

## Success Criteria

- Protected REST handlers under `/api/todos` no longer call `requireSessionFromRequest` directly.
- Authentication for those handlers is enforced by shared REST middleware.
- Handlers access the authenticated user through middleware context.
- Unauthorized REST responses remain consistent and centralized.
- Server-function auth behavior remains unchanged.
