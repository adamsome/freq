# Todo

Feature ideas and game notes live in `todo.local.md` (untracked).

## Bugs

- Audit elements with conflicting Tailwind utilities (e.g. two `text-*xl`
  sizes, two `bg-*` shades on one element). Tailwind 3.2 ordered utilities by
  discovery order, so which class won was luck; 3.3+ orders by theme. The
  `Title` font size was one (fixed). Mostly in `components/control/button.tsx`
  (variant classes plus a `className` override) and the blow components.
  Consider `tailwind-merge` in `cx`.
- `lib/util/use-theme.tsx` is a vendored next-themes 0.0.12 that injects its
  anti-flash `<script>` via `next/head`, which Next warns about. Replace with
  the `next-themes` package.

## Chores

- Fix the 40 ESLint errors surfaced by `eslint-config-next` 16 (mostly the new
  `react-hooks` rules: `set-state-in-effect`, `static-components`, `refs`).
- `react-spring-bottom-sheet` (blow players sheet) is unmaintained and only
  supports React ≤18; it runs via an npm `overrides` entry. Replace it (e.g.
  with `vaul`) and drop the overrides for it, `@reach/portal` and
  `@xstate/react`.
- `@reduxjs/toolkit` 1.9 has an optional React ≤18 peer, also overridden.
  Upgrade to RTK 2 and drop that override.
- Remaining `npm audit` findings: `@auth0/nextjs-auth0`/`cookie` → v4;
  `lint-staged` (`micromatch`, `yaml`) → 17; `minimatch` via
  `eslint-config-next`'s typescript-eslint (dev only).
- Husky hooks are configured in `package.json` (husky 4 format), which husky
  8 ignores, so pre-commit lint-staged and pre-push type-check never run.
  Migrate to `.husky/` or drop husky.
- `next-env.d.ts` is gitignored (dev and build rewrite it), so CI must run
  `next typegen` before `tsc`.
