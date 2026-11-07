<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# freq project notes

Party-game site (Freq, Cwd, Blow, Res/"Unter") on the Next.js **Pages Router**
(`pages/`, no `app/`), React 19, MongoDB Atlas, Auth0 (`@auth0/nextjs-auth0`),
Tailwind 3. Deployed on Vercel: pushes to `main` go to production.

## Workflow

- Node 24 via nvm (`.nvmrc`); the shell's default `node` may be a different
  Homebrew version, so run `nvm use` first.
- Dev server: `npm run dev` → http://localhost:3001 (debugger on 9230), to
  avoid clashing with the sibling `lqr` project on 3000/9229.
- Checks: `npx tsc --noEmit`, `npm run lint` (ESLint 9 flat config in
  `eslint.config.mjs`), `npm run build`. `next build` does not lint.
- Follow-ups live in `todo.md` (Bugs / Chores); `todo.local.md` is untracked
  personal notes.
- Don't write to the production database, or change Vercel or Auth0 settings,
  without asking.

## Code layout

- `pages/[game]/[room].tsx` renders a game by type; `pages/api/<game>/[room]/*`
  are the game API routes (GET of a missing room creates and joins it).
- `lib/<game>/` holds game logic and Mongo stores; `lib/util/mongodb.ts` is the
  shared connection.
- `components/control/` holds shared UI (`Button`, `Title`, ...); `cx` in
  `lib/util/dom.ts` joins class names.

## Gotchas

- React 19 ignores `defaultProps` on function components. Use destructuring
  defaults (`size = defaultProps.size`) instead.
- Avoid conflicting Tailwind utilities on one element (e.g. `text-6xl` and
  `text-7xl`): which one wins depends on CSS rule order, not class order.
- In dev, Next waits for `requestAnimationFrame` before hydrating, so pages
  stay blank in a hidden/background browser tab.
