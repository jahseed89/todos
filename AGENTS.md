# AGENTS.md

Single-package React + Vite + Tailwind **v4** todo app. Plain JSX (no TypeScript), no
test framework, no monorepo.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # production build to dist/
npm run lint      # oxlint (NOT eslint)
npm run preview   # serve the built output
```

There is **no `test` script and no test runner** — don't add or assume one. There is
also no formatter (no Prettier), so don't introduce formatting-only diffs.

## Tailwind v4 — do not use v3 conventions

Configured entirely through the `@tailwindcss/vite` plugin in `vite.config.js` plus
`@import 'tailwindcss'` at the top of `src/index.css`.

- **There is no `tailwind.config.js` and no `postcss.config.js`.** Creating either is
  wrong for v4; config lives in CSS.
- Design tokens go in the `@theme` block in `src/index.css`. The palette is a custom
  `brand-*` (oklch) scale — it is *not* Tailwind's `indigo`. Prefer `brand-600` etc.
  over reaching for stock colors.
- Custom utilities use the `@utility` directive (`shadow-lifted`, `shadow-lifted-lg`),
  not `@layer utilities`.
- Base-layer rules belong in `@layer base` in `index.css`, not scattered per component.

Two gotchas already handled here — don't regress them:

- **v4 preflight does not set `cursor: pointer` on `<button>`.** The
  `:where(button:not(:disabled))` rule in `index.css` exists solely to restore it.
  The `:where()` wrapper keeps specificity at zero on purpose: a plain
  `button:not(:disabled)` (specificity 0-1-1) would beat the `.cursor-text` class on
  the saved-note preview, which must keep a text caret.
- A `@utility` is only emitted if its name appears **literally** in a scanned
  `className`, and only in the variant forms actually used.

## Architecture

All application state lives in `src/hooks/useTodos.js`. That one hook owns the todo
list, the status filter, the search query, derived counts, the derived `visibleTodos`,
and `localStorage` persistence. Everything in `src/components/` is presentational and
receives handlers as props — do not lift state into components or duplicate it.

Storage notes:

- `STORAGE_KEY` is `'taskly.todos.v1'`. **This is intentionally stale** — the app was
  renamed from "Taskly" to "Todo" but the key was left alone so existing saved todos
  would not be wiped. Renaming it silently destroys user data. Change it only if the
  user explicitly accepts losing saved tasks.
- Persistence writes from a `useEffect` on `[todos]`. All `localStorage` access is
  wrapped in `try/catch` and degrades to in-memory state, so keep that when touching it.
- `normalise()` validates shape on load; unreadable or corrupt storage must not crash
  the app.

## Lint

`oxlint`, configured in `.oxlintrc.json`:

- `react/rules-of-hooks: error`
- `react/only-export-components: warn` (with `allowConstantExport: true`) — a `.jsx`
  file exporting a component next to a non-component (other than a constant) warns.
  Note `useTodos.js` exports only the hook, so it is unaffected.
- `react(set-state-in-effect)` warns. The codebase avoids this on purpose by seeding
  state on the user action instead of syncing with an effect — see `startEditing` in
  `src/components/NotesEditor.jsx`, which sets the draft when editing begins rather
  than pushing `notes` into state from an effect. Follow that pattern.

Run `npm run lint` after edits; it is fast and the build is the only other gate.

## Environment gotchas

- **Port 5173 is often already taken** by another `node` process; Vite then binds 5174.
  Read the URL Vite actually prints rather than assuming 5173.
- **This is not a git repo** (no `.git`). There is a `.gitignore` but nothing is
  tracked, so there is no commit/branch/PR convention to follow.

## Verifying changes

The in-app browser tool returns `browser.disconnected` unless the session is open in
the OpenCode **desktop app**. When it is unavailable, verify via `npm run build`,
`npm run lint`, and HTTP requests against the dev server — and say plainly in your
summary that the UI was not visually checked.

To confirm a CSS utility actually compiled, grep the build output in
`dist/assets/*.css`. Two traps that produce false negatives:

- Utilities used **only** under a variant have no standalone rule — `shadow-lifted-lg`
  appears solely as `.hover\:shadow-lifted-lg:hover`, so a plain substring search for
  `.shadow-lifted-lg` finds nothing even though it works.
- Decimal utilities are escaped in the output: `pl-9.5` is emitted as `.pl-9\.5`.
