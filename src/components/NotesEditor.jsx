import { useEffect, useRef, useState } from 'react'
import { CheckIcon, NoteIcon } from './Icons.jsx'

/**
 * Inline notes editor for a single todo.
 *
 * Notes save on blur, on Ctrl/Cmd+Enter, or via the Save button, so nothing is
 * ever lost by tabbing away.
 */
export default function NotesEditor({ notes, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const textareaRef = useRef(null)

  // The draft is re-seeded from `notes` each time editing starts (see
  // startEditing), so no sync effect is needed here.
  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      // Put the caret at the end so appending feels natural.
      const el = textareaRef.current
      el?.setSelectionRange(el.value.length, el.value.length)
    }
  }, [isEditing])

  function startEditing() {
    setDraft(notes)
    setIsEditing(true)
  }

  function commit() {
    onSave(draft)
    setIsEditing(false)
  }

  function cancel() {
    setDraft(notes)
    setIsEditing(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancel()
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      commit()
    }
  }

  if (isEditing) {
    return (
      <div className="animate-slide-up mt-3">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          rows={3}
          maxLength={2000}
          placeholder="Add details, links, or reminders…"
          className="w-full resize-y rounded-xl border border-brand-200 bg-brand-50/40 px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={commit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <CheckIcon className="size-3.5" />
            Save note
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={cancel}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            Cancel
          </button>
          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">
            {draft.length}/2000 &middot; Ctrl+Enter to save
          </span>
        </div>
      </div>
    )
  }

  if (notes) {
    return (
      <div className="group/notes mt-3">
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full cursor-text items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/50"
        >
          <NoteIcon className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
            {notes}
          </p>
        </button>
        <p className="mt-1.5 pl-1 text-[11px] text-slate-400 opacity-0 transition-opacity group-hover/notes:opacity-100">
          Click the note to edit it
        </p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:text-brand-600"
    >
      <NoteIcon className="size-4" />
      Add a note
    </button>
  )
}
