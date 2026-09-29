import { useEffect, useRef, useState } from 'react'
import NotesEditor from './NotesEditor.jsx'
import { TrashIcon } from './Icons.jsx'

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  if (isToday) return `Today at ${time}`
  return `${date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })} at ${time}`
}

export default function TodoItem({ todo, onToggle, onDelete, onNotesChange }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const confirmTimer = useRef(null)

  // Clear the auto-cancel timer if this task is deleted mid-confirmation.
  useEffect(() => () => clearTimeout(confirmTimer.current), [])

  function handleDelete() {
    // First click arms the delete; a second click within the window removes it.
    if (isConfirming) {
      onDelete(todo.id)
      return
    }
    setIsConfirming(true)
    // Auto-cancel if the user changes their mind.
    confirmTimer.current = setTimeout(() => setIsConfirming(false), 3500)
  }

  return (
    <li
      className={`animate-slide-up group rounded-2xl border bg-white p-4 transition-all duration-200 sm:p-5 ${
        todo.completed
          ? 'border-slate-200/70 opacity-70'
          : 'border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lifted-lg'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={todo.completed}
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
            todo.completed
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-slate-300 bg-white text-transparent hover:border-brand-500 hover:bg-brand-50'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`size-3.5 transition-transform duration-200 ${
              todo.completed ? 'scale-100' : 'scale-50'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </button>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-[15px] leading-snug font-medium break-words transition-colors ${
              todo.completed
                ? 'text-slate-400 line-through decoration-slate-300'
                : 'text-slate-800'
            }`}
          >
            {todo.title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {todo.completed ? 'Completed' : 'Added'} &middot;{' '}
            {formatDate(todo.createdAt)}
          </p>

          <NotesEditor
            notes={todo.notes}
            onSave={(value) => onNotesChange(todo.id, value)}
          />
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          title={isConfirming ? 'Click again to delete' : 'Delete task'}
          aria-label={
            isConfirming ? `Confirm delete ${todo.title}` : `Delete ${todo.title}`
          }
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            isConfirming
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'text-slate-300 hover:bg-red-50 hover:text-red-500'
          } focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}
        >
          <TrashIcon className="size-4.5" />
        </button>
      </div>

      {isConfirming && (
        <p className="animate-fade-in mt-2 pl-9.5 text-xs font-medium text-red-500">
          Click the bin again to permanently delete.
        </p>
      )}
    </li>
  )
}
