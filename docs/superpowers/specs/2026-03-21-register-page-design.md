# Register Page Design

## Goal

Refresh `src/routes/_sub/auth/register.tsx` into a polished shadcn-inspired registration page that feels clean, professional, and trustworthy while keeping the existing TanStack Form flow intact.

Scope is intentionally narrow: improve this single route file, prefer existing UI primitives already present in the project, and avoid introducing shared auth abstractions unless the route cannot be styled cleanly without them.

## Current State

- The page is a plain stacked form with minimal spacing and no page-level visual structure.
- Validation messages render as raw inline text, which makes errors feel unfinished.
- The page already uses `Input` and `Button`, but it does not yet use higher-level shadcn layout patterns such as card-based composition.
- `src/routes/_sub/auth/login.tsx` is also very minimal, so the register page should establish a reusable auth-page direction without depending on a full shared auth layout yet.

## Recommended Approach

Implement a centered white or near-white card within a softly tinted auth surface that works with the app's existing global background.

Inside the card:

- Add a compact header with a title and supporting description.
- Group each field into a consistent vertical form row with label, input, and styled validation text.
- Use a full-width primary submit button and a quieter secondary reset action.
- Add a low-emphasis footer prompt for existing users to sign in later.

This approach gives the route a mature product feel with modest code changes and no unnecessary new abstractions.

It does not attempt to restyle the login route in the same pass; the footer link exists for navigation continuity, while visual parity with login remains a future follow-up.

Implementation should use the primitives already present in the repo: `Input`, `Button`, native `label`, and route-level Tailwind classes. Do not introduce new shared shadcn components such as `Card`, `Label`, or form wrappers for this task. The visual target is shadcn-inspired spacing, border treatment, shadow, and hierarchy using those existing primitives only.

## Alternatives Considered

### 1. Centered Card Over Soft Gradient

Recommended. Best balance of product polish, implementation cost, and future reuse for auth pages.

### 2. Split-Screen Marketing + Form Layout

Would look richer on desktop, but it introduces more content design work and creates a larger gap between mobile and desktop layouts for a single register route.

### 3. Ultra-Minimal Bare Form

Simplest to implement, but too visually plain to satisfy the requested shadcn-style polish.

## Design Details

### Layout

- Use a route-local container that fills available width and creates a generous auth-page section below the sticky header rather than forcing exact viewport centering.
- Reuse the app's existing global background art direction from `src/styles.css` instead of layering a second heavy backdrop.
- If extra route-level decoration is needed, keep it to one very subtle translucent panel or one soft blur accent only.
- Center a registration card with a max width around `420-480px`, generous padding, soft shadow, and light border.
- Because `src/routes/_sub.tsx` only provides a centered flex wrapper, the register route should define its own `w-full`, top/bottom spacing, and minimum-height behavior locally so the layout renders predictably beneath the header.

### Typography And Hierarchy

- Lead with `欢迎注册` as the main heading.
- Add a short supporting sentence describing account creation.
- Keep copy concise and businesslike rather than playful.

### Form Composition

- Render fields in the order: email, password, username.
- Use clear labels above each input.
- Keep inputs consistent in height, radius, border, and focus treatment.
- Set the email field to `type="email"` and use appropriate autocomplete hints where straightforward.
- Set the password field to `type="password"`.
- Replace the current raw error rendering with small red helper text and optional muted validating text.

### Actions

- Make `注册` the full-width primary action.
- Keep `重置` as a secondary ghost or outline-style action below or beside the primary button depending on available width.
- Preserve the current form submission and reset behavior.

### Supporting UI

- Add a low-contrast footer line such as `已有账号？去登录` to support auth flow cohesion.
- Render `去登录` as a real link to `/auth/login` using the router link component, with subdued styling so it remains supportive rather than competing with the primary action.
- Use small decorative copy only; do not add marketing-heavy sections or extra fields.

### Theme Behavior

- The page should respect the app's existing light and dark theme variables.
- In light mode, the card should read as white or near-white.
- In dark mode, adapt the same layout using existing dark surface and border tokens rather than forcing a bright light-only card.

### Accessibility And Responsiveness

- Maintain explicit labels for all inputs.
- Keep focus-visible states obvious.
- Ensure mobile widths have comfortable side padding and no horizontal overflow.
- Respect reduced-motion expectations by keeping animation minimal or decorative only.

### Visual Constraints

- Keep decoration restrained: one soft gradient background and at most one or two blurred accents.
- Do not add illustrations, feature lists, badges, or split-layout marketing content.
- Keep all work local to the route unless an already-existing component can be imported directly.

## Error Handling

- Keep all existing schema-driven validation behavior.
- Change only presentation of error and validation states.
- Ensure disabled and submitting states remain obvious on the primary button.

## Testing

- Run `bun run build` after the UI update as the required verification command for this task.
- Manually confirm these concrete checks:
  - the page presents a visually centered card within the auth section beneath the sticky header
  - the route-level styling works with the existing global background instead of fighting it
  - labels, inputs, and error text are visually aligned and readable
  - the password field masks input
  - `注册` is the visually dominant action
  - `重置` is visually secondary
  - dark mode preserves contrast and card readability
  - the layout remains readable on mobile width and desktop width without horizontal scroll

## Success Criteria

- The page has a centered card layout with a light gradient background and clear visual hierarchy.
- The implementation stays within the existing route file unless it reuses an already-existing UI component.
- Form behavior and validation continue to work as before.
- Error text, labels, inputs, and actions look intentionally styled rather than raw browser-default markup.
- The result is simple enough to mirror later in `src/routes/_sub/auth/login.tsx` without refactoring.
