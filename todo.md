# Todo

Feature ideas and game notes live in `todo.local.md` (untracked).

## Bugs

- Audit elements with conflicting Tailwind utilities (e.g. two `text-*xl`
  sizes, two `bg-*` shades on one element). Tailwind 3.2 ordered utilities by
  discovery order, so which class won was luck; 3.3+ orders by theme. The
  `Title` font size was one (fixed). Mostly in `components/control/button.tsx`
  (variant classes plus a `className` override) and the blow components.
  Consider `tailwind-merge` in `cx`.

## Chores

- Remaining `npm audit` findings all need majors: `next` (critical, plus
  bundled `postcss`) → Next 16; `@auth0/nextjs-auth0`/`cookie` → v4;
  `lint-staged` (`micromatch`, `yaml`) → 17.
- Husky hooks are configured in `package.json` (husky 4 format), which husky
  8 ignores, so pre-commit lint-staged and pre-push type-check never run.
  Migrate to `.husky/` or drop husky.
- Add Auth0 Allowed Callback/Logout URLs for `http://localhost:3001`.
