# Register Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `src/routes/_sub/auth/register.tsx` into the approved shadcn-inspired auth card while preserving the existing TanStack Form behavior.

**Architecture:** Keep the work local to the register route and verify it with one focused route rendering test plus the required project build and manual UI checks from the spec. Reuse the existing `Input` and `Button` primitives, add a softly tinted auth surface and card layout inside the route, keep the field order fixed as `email -> password -> username`, and align the footer login link with the generated `/auth/login` path.

**Tech Stack:** TypeScript, React, TanStack Router, TanStack Form, Tailwind CSS, Vitest, Testing Library

---

### File Structure

- Modify: `src/routes/_sub/auth/register.tsx` - apply the new auth page structure, styles, field attributes, helper text styling, and footer link.
- Create: `tests/register-page.test.tsx` - cover the smallest meaningful UI contract by rendering the actual `/auth/register` route under the existing router.
- Reuse: `src/router.tsx` - use the router factory in tests instead of exporting extra production-only symbols.
- Verify: `package.json` - use the existing `test` and `build` scripts only; no script changes needed.

### Task 1: Add A Failing Register Page UI Test

**Files:**

- Create: `tests/register-page.test.tsx`
- Reuse: `src/router.tsx`
- Test: `tests/register-page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

import { getRouter } from '../src/router'

describe('register route', () => {
  it('renders the polished register form structure', () => {
    const router = getRouter()

    void router.navigate({ to: '/auth/register' })

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: '欢迎注册' }).textContent).toBe(
      '欢迎注册',
    )
    expect((screen.getByLabelText('邮箱') as HTMLInputElement).type).toBe(
      'email',
    )
    expect((screen.getByLabelText('密码') as HTMLInputElement).type).toBe(
      'password',
    )
    expect(screen.getByLabelText('用户昵称')).toBeTruthy()
    expect(screen.getByRole('button', { name: '注册' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '重置' })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: '去登录' }).getAttribute('href'),
    ).toBe('/auth/login')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test tests/register-page.test.tsx`
Expected: FAIL because the current route does not yet render the approved heading and footer link, does not give the email/password inputs the required types, and does not include the complete field set.

### Task 2: Implement The Register Page Layout

**Files:**

- Modify: `src/routes/_sub/auth/register.tsx`
- Test: `tests/register-page.test.tsx`

- [ ] **Step 1: Apply the approved auth-page structure and styling**

```tsx
return (
  <div className="relative flex min-h-[calc(100vh-8rem)] w-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
    <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-background/0 to-background" />
    <div className="absolute inset-x-0 top-8 mx-auto h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
    <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">欢迎注册</h1>
        <p className="text-sm text-muted-foreground">
          创建账号后即可开始管理你的任务与计划。
        </p>
      </div>
      {/* form content */}
    </div>
  </div>
)
```

- [ ] **Step 2: Run the focused test and keep it failing only for the next missing requirement**

Run: `bun run test tests/register-page.test.tsx`
Expected: FAIL for the next missing UI contract, not for missing router providers or unsupported matchers.

- [ ] **Step 3: Update field markup and semantics**

```tsx
<label htmlFor={field.name} className="text-sm font-medium text-foreground">
  邮箱
</label>
<Input
  id={field.name}
  name={field.name}
  type="email"
  autoComplete="email"
  ...
/>
```

Apply the same pattern for password and username with `type="password"`, `autoComplete="new-password"`, and `autoComplete="nickname"` respectively, while preserving the field order `email`, `password`, `username`.

- [ ] **Step 4: Run the focused test and confirm it still fails for remaining structure or copy gaps**

Run: `bun run test tests/register-page.test.tsx`
Expected: FAIL until the heading, footer link, and polished action layout are complete.

- [ ] **Step 5: Replace raw validation output with styled helper text**

```tsx
function FieldInfo({ field }: { field: AnyFieldApi }) {
  if (field.state.meta.isTouched && !field.state.meta.isValid) {
    return (
      <div className="space-y-1 text-sm text-destructive">
        {field.state.meta.errors.map((err) => (
          <p key={err.message}>{err.message}</p>
        ))}
      </div>
    )
  }

  return field.state.meta.isValidating ? (
    <p className="text-sm text-muted-foreground">校验中...</p>
  ) : null
}
```

- [ ] **Step 6: Add the footer login link and action layout**

```tsx
<Button type="submit" className="w-full" disabled={!canSubmit}>
  {isSubmitting ? '提交中...' : '注册'}
</Button>
<Button type="reset" variant="ghost" className="w-full" ...>
  重置
</Button>
<p className="text-center text-sm text-muted-foreground">
  已有账号？
  <Link to="/auth/login" className="font-medium text-foreground underline-offset-4 hover:underline">
    去登录
  </Link>
</p>
```

- [ ] **Step 7: Run the focused test to verify it passes**

Run: `bun run test tests/register-page.test.tsx`
Expected: PASS.

### Task 3: Verify The Route Still Builds

**Files:**

- Test: `tests/register-page.test.tsx`
- Test: `src/routes/_sub/auth/register.tsx`

- [ ] **Step 1: Run the route build verification**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 2: Manually verify the spec-required UI checks**

Check in browser at mobile and desktop widths, and in dark mode:

- the card sits cleanly within the auth section below the sticky header
- the page styling feels consistent with the existing global background
- labels, inputs, helper text, and actions are visually aligned
- `注册` is visually dominant and `重置` is secondary
- the password field masks input and reset still clears the form
- there is no horizontal overflow
