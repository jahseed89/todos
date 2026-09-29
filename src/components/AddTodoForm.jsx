import { useId, useRef, useState } from 'react'
import { NoteIcon, PlusIcon } from './Icons.jsx'

/**
 * Form for creating a todo. The notes field is collapsed by default and opens
 * only when the user asks for it, so the common case (just a title) stays fast.
 */
export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const titleId = useId()
  const notesId = useId()
  const titleRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const addedId = onAdd(title, notes)
    if (!addedId) return

    setTitle('')
    setNotes('')
    setShowNotes(false)
    // Keep focus here so several todos can be added in a row.
    titleRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition-shadow focus-within:border-brand-300 focus-within:bg-white focus-within:shadow-lifted sm:p-5"
    >
      <label htmlFor={titleId} className="sr-only">
        What needs to be done?
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <PlusIcon className="size-5" />
          </span>
          <input
            ref={titleRef}
            id={titleId}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            autoComplete="off"
            maxLength={200}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={title.trim() === ''}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100"
        >
          <PlusIcon className="size-4.5" />
          Add task
        </button>
      </div>

      {/* Notes section */}
      {showNotes ? (
        <div className="animate-slide-up mt-3">
          <label
            htmlFor={notesId}
            className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
          >
            Notes <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id={notesId}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Add details, links, or reminders…"
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 focus:outline-none"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <NoteIcon className="size-4" />
          Add notes to this task
        </button>
      )}
    </form>
  )
}
