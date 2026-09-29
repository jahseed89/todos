import { SearchIcon } from './Icons.jsx'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export default function FilterBar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  counts,
  onClearCompleted,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 sm:p-4">
      {/* Status filters */}
      <div
        role="tablist"
        aria-label="Filter tasks"
        className="flex gap-1 rounded-xl bg-slate-200/70 p-1"
      >
        {TABS.map((tab) => {
          const isActive = filter === tab.key
          const count =
            tab.key === 'all'
              ? counts.total
              : tab.key === 'active'
                ? counts.active
                : counts.completed

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search + bulk actions */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <SearchIcon className="size-4" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search tasks and notes…"
            aria-label="Search tasks and notes"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 focus:outline-none [&::-webkit-search-cancel-button]:cursor-pointer"
          />
        </div>

        {counts.completed > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="h-10 shrink-0 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  )
}
