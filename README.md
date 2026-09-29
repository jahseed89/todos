# Todo

A simple, clean todo list built with **React**, **Vite**, and **Tailwind CSS v4**.

## Features

- **Add** a todo with an optional note.
- **View** all todos with live counts and a completion progress bar.
- **Complete** a todo with a one-click checkbox.
- **Delete** a todo (with a confirm step so it is never a misclick).
- **Notes** — attach extra details to any todo and edit them in place.
- Filter by All / Active / Completed, and **search** across titles and notes.
- Tasks persist to `localStorage`, so a refresh never loses your list.

### A few interface details

- **Add task** keeps the cursor in the input after you submit, so you can add
  several tasks in a row without clicking back.
- **The delete button appears on hover** on desktop screens (it is always visible
  on touch devices, where there is no hover).
- Limits: **200 characters** for a task title, **2000** for a note.
- Clicking a saved note opens it for editing.

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the source with oxlint |

## Project structure

```
src/
├── main.jsx                 # React entry point (mounts <App />)
├── App.jsx                  # Page layout, header, container, progress bar
├── index.css                # Tailwind import, theme tokens, base styles
├── components/
│   ├── AddTodoForm.jsx      # New-task form with an expandable notes field
│   ├── TodoItem.jsx         # A single task: checkbox, title, note, delete
│   ├── NotesEditor.jsx      # In-place note editor (blur / Ctrl+Enter to save)
│   ├── FilterBar.jsx        # Status tabs, counts, search, clear completed
│   ├── EmptyState.jsx       # Context-aware empty messages
│   └── Icons.jsx            # Inline SVG icons
└── hooks/
    └── useTodos.js          # All todo state, persistence, and filtering
```

`main.jsx` mounts `App`, which owns the page shell. All application state lives in
the `useTodos` hook, which also owns the `localStorage` persistence and derives the
filtered list, so the components stay presentational.

## Design

The app content sits in a single elevated "glass" card that floats above an
ambient, blurred colour background, so the whole thing reads as one object
rather than a stack of flat cards.

- **Layered shadows.** `shadow-lifted` and `shadow-lifted-lg` are custom
  `@utility` definitions in `src/index.css`. Each stacks four shadows — a
  hairline contact shadow, a mid ambient layer, and a deep indigo-tinted glow —
  which is what makes the container look lit from above. Task cards use
  `shadow-lifted-lg` on hover so they rise off the sheet.
- **Depth hierarchy.** The container is translucent (`bg-white/80` +
  `backdrop-blur-xl`); the form, filter bar, and progress bar sit *inside* it as
  sunken `bg-slate-50/80` panels, and task cards sit on top as solid white. That
  in/out/in ordering is deliberate — don't flatten it back to white-on-white.
- **The shadow needs contrast.** A shadow is only visible against a background
  with some colour in it, which is why the page background is a tinted
  `slate-200` with blurred brand/indigo/sky blobs rather than flat grey.
- All motion respects `prefers-reduced-motion`.

## Notes on the implementation

- **Tailwind v4** is wired up through the `@tailwindcss/vite` plugin. There is no
  `tailwind.config.js` and no PostCSS config — brand colours and animations are
  declared as theme tokens in `src/index.css` under `@theme`, and custom
  utilities under `@utility`, which is where v4 keeps both.
- **The palette is custom.** `brand-*` is an oklch scale defined in `@theme`;
  it is not Tailwind's `indigo`. Prefer `brand-600` over reaching for stock
  colours.
- **v4 preflight does not set `cursor: pointer` on `<button>`.** The
  `:where(button:not(:disabled))` rule in `index.css` exists solely to restore
  it. The `:where()` wrapper keeps specificity at zero on purpose, so the
  saved-note preview can keep its `cursor-text` caret.
- **Notes save on blur** or with `Ctrl`/`Cmd` + `Enter`, so switching focus never
  discards typing. `Escape` cancels.
- **Deleting asks twice.** The first click arms the delete and starts a 3.5s
  timer; a second click within that window removes the task.
- **Storage failures are non-fatal.** Unreadable or full `localStorage` falls
  back to in-memory state instead of crashing the app.
- There is **no test suite** — `npm run build` and `npm run lint` are the checks.
