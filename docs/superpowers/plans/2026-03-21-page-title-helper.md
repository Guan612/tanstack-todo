# Page Title Helper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace repeated inline route `head` definitions with a shared helper that returns a TanStack Router-compatible page-title `head` function.

**Architecture:** Add a tiny helper in `src/lib/page-head.ts` with a narrow `title -> head function` API, then switch the login route to consume it. Cover the helper with a focused unit test and keep broader route/build verification in place.

**Tech Stack:** TypeScript, TanStack Router, Vitest

---

### Task 1: Add Helper Test

**Files:**

- Create: `tests/page-head.test.ts`
- Test: `tests/page-head.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'

import { createPageHead } from '../src/lib/page-head'

describe('createPageHead', () => {
  it('returns a head function with a title meta entry', () => {
    const head = createPageHead('注册')

    expect(head()).toEqual({
      meta: [{ title: '注册' }],
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/page-head.test.ts`
Expected: FAIL because `src/lib/page-head.ts` does not exist yet.

### Task 2: Implement Helper And Route Usage

**Files:**

- Create: `src/lib/page-head.ts`
- Modify: `src/routes/_sub/auth/login.tsx`
- Test: `tests/page-head.test.ts`

- [ ] **Step 1: Write minimal implementation**

```ts
export const createPageHead = (title: string) => () => ({
  meta: [{ title }],
})
```

- [ ] **Step 2: Update the login route to use the helper**

```ts
import { createPageHead } from '../../../lib/page-head'

head: createPageHead('注册')
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- tests/page-head.test.ts`
Expected: PASS.

### Task 3: Verify No Route Regressions

**Files:**

- Test: `tests/router-build.test.ts`

- [ ] **Step 1: Run broader verification**

Run: `npm test -- tests/router-build.test.ts`
Expected: PASS.
