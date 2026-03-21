## Goal

Avoid repeating the same `head: () => ({ meta: [{ title }] })` block in every route component while keeping per-page titles explicit.

## Current State

- `src/routes/__root.tsx` defines global base meta tags.
- Individual routes can define their own `head` function.
- `src/routes/_sub/auth/login.tsx` currently hardcodes a page title through a repeated `meta` array.

## Recommended Approach

Add a small shared helper in `src/lib/page-head.ts` that accepts a page title and returns a TanStack Router-compatible `head` function.

Example target usage:

```ts
head: createPageHead('注册')
```

The helper will internally return:

```ts
;() => ({
  meta: [{ title }],
})
```

Concrete API for the initial implementation:

```ts
export const createPageHead = (title: string) => () => ({
  meta: [{ title }],
})
```

Type handling for the first version should stay minimal and rely on TypeScript inference unless the route file requires an explicit annotation.

## Alternatives Considered

### 1. Route-level helper returning `head` directly

Recommended. Smallest change, explicit titles, easy to extend later.

### 2. Higher-order route config helper

Would reduce some repetition but couples route creation to a custom wrapper and makes route definitions less obvious.

### 3. Infer title from route path or file name

Removes explicit page titles and becomes brittle for localized titles such as `注册`.

## Design Details

- Keep global root meta in `src/routes/__root.tsx` unchanged.
- Create a reusable helper with a narrow API: title in, `head` function out.
- Initial implementation scope is intentionally small: add `src/lib/page-head.ts` and update only `src/routes/_sub/auth/login.tsx`.
- Future routes can adopt the helper incrementally after this first change.
- Preserve the ability to add richer page metadata later by expanding the helper rather than touching every route.

## Error Handling

- No runtime error handling is required for the initial version.
- Empty titles are not expected from current usage; the helper stays minimal unless broader validation becomes necessary.

## Testing

- Update or add a small router-related test only if existing coverage depends on generated route metadata.
- At minimum, run the existing test suite to verify the refactor does not break route compilation.

## Success Criteria

- A route can declare its title without manually writing the full `meta` array.
- Existing route behavior stays the same.
- The helper is simple enough to reuse for future routes.
