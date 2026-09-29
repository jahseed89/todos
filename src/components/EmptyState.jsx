import { ClipboardIcon } from './Icons.jsx'

/**
 * Shown when the list is empty. The message adapts so a search with no matches
 * never tells the user to add a task they already added, and a filter that is
 * simply empty gets its own wording.
 */
export default function EmptyState({ isSearching, filter, counts, onReset }) {
  if (isSearching) {
    return (
      <Empty
        icon={<ClipboardIcon className="mx-auto size-11 text-slate-300" />}
        title="No matching tasks"
        body="Nothing here matches your search. Try a different word or clear the search."
        action={
          <button
            type="button"
            onClick={onReset}
            className="mt-5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Clear search
          </button>
        }
      />
    )
  }

  if (filter === 'completed') {
    return (
      <Empty
        icon={<ClipboardIcon className="mx-auto size-11 text-slate-300" />}
        title="Nothing completed yet"
        body="Finished tasks will appear here so you can keep track of your wins."
      />
    )
  }

  if (filter === 'active') {
    return (
      <Empty
        icon={<ClipboardIcon className="mx-auto size-11 text-brand-300" />}
        title="All caught up!"
        body={
          counts.completed > 0
            ? 'Every task is done. Switch to the "Completed" tab to review them.'
            : 'You have no open tasks right now. Add one above to get started.'
        }
      />
    )
  }

  return (
    <Empty
      icon={<ClipboardIcon className="mx-auto size-11 text-brand-300" />}
      title="Your list is clear"
      body="Add your first task above and it will show up here. Add a note to keep the details handy."
    />
  )
}

function Empty({ icon, title, body, action }) {
  return (
    <div className="animate-fade-in rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-14 text-center">
      {icon}
      <h3 className="mt-4 text-base font-semibold text-slate-700">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500">{body}</p>
      {action}
    </div>
  )
}
