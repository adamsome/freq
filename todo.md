# Todo

Feature ideas and game notes live in `todo.local.md` (untracked).

## Bugs

- Audit elements with conflicting Tailwind utilities (e.g. two `text-*xl`
  sizes, two `bg-*` shades on one element). Tailwind 3.2 ordered utilities by
  discovery order, so which class won was luck; 3.3+ orders by theme. The
  `Title` font size was one (fixed). Mostly in `components/control/button.tsx`
  (variant classes plus a `className` override) and the blow components.
  Consider `tailwind-merge` in `cx`.
- Game writes are read-modify-write with no concurrency guard. Freq's round
  reveal is now conditional on phase, but Cwd `lock_guess` and Blow `action`
  can still double-count lifetime stats when two calls race (the phase
  doesn't change between turns). Add a revision counter to game documents
  and make updates conditional on it.
- Game views expose players' Auth0 IDs (`auth0|…`) to anyone who views a
  room. Harmless now that writes use the session user, but an opaque
  per-player ID would hide them (refactor).

## Chores

- Fix the 40 ESLint errors surfaced by `eslint-config-next` 16 (mostly the new
  `react-hooks` rules: `set-state-in-effect`, `static-components`, `refs`).
- Deferred majors: ESLint 10 (wait for `eslint-config-next` support),
  TypeScript 7 (native compiler; check Next 16 support), Tailwind 4 (own
  step). `@types/node` stays on 24 to match the Node 24 runtime.
- Remaining `npm audit` findings (8 moderate, dev only): `minimatch` via
  `eslint-config-next`'s typescript-eslint.
- `next-env.d.ts` is gitignored (dev and build rewrite it), so CI must run
  `next typegen` before `tsc`.
- Vercel env: add `APP_BASE_URL=https://freq-nine.vercel.app` and
  `AUTH0_DOMAIN=dev-q-0rj9cc.us.auth0.com`, then delete `AUTH0_BASE_URL`,
  `AUTH0_ISSUER_BASE_URL` and the v1 fallback in `lib/auth0.ts`. Check
  whether `SECRET_COOKIE_PASSWORD` is still used.
- Auth0 dashboard: remove the old `/api/auth/callback` URLs once production
  runs v4.
