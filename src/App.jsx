import AddTodoForm from './components/AddTodoForm.jsx'
import EmptyState from './components/EmptyState.jsx'
import FilterBar from './components/FilterBar.jsx'
import TodoItem from './components/TodoItem.jsx'
import { useTodos } from './hooks/useTodos.js'

export default function App() {
  const {
    todos,
    visibleTodos,
    filter,
    setFilter,
    query,
    setQuery,
    counts,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateNotes,
    clearCompleted,
  } = useTodos()

  const isSearching = query.trim() !== ''
  const progress =
    counts.total === 0 ? 0 : Math.round((counts.completed / counts.total) * 100)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient colour wash — gives the container's shadow something to sit on. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-slate-200/50" />
        <div className="absolute -top-48 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-brand-400/35 blur-3xl" />
        <div className="absolute top-1/4 -right-32 h-80 w-80 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <header className="mb-7 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3 shadow-lg shadow-brand-600/30 ring-4 ring-white/60">
            <svg
              viewBox="0 0 24 24"
              className="size-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Todo
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 sm:text-base">
            Keep your tasks and their notes in one tidy place.
          </p>
        </header>

        {/* Elevated container — the app's one strong visual anchor. */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lifted ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-7">
          <main className="space-y-4">
            <AddTodoForm onAdd={addTodo} />

            {todos.length > 0 && (
              <>
                <FilterBar
                  filter={filter}
                  onFilterChange={setFilter}
                  query={query}
                  onQueryChange={setQuery}
                  counts={counts}
                  onClearCompleted={clearCompleted}
                />

                {/* Progress bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>
                      {counts.completed} of {counts.total} completed
                    </span>
                    <span className="text-brand-700 tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Completion progress"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 shadow-sm shadow-brand-500/40 transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* List */}
            {visibleTodos.length > 0 ? (
              <ul className="space-y-3">
                {visibleTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onNotesChange={updateNotes}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                isSearching={isSearching}
                filter={filter}
                counts={counts}
                onReset={() => setQuery('')}
              />
            )}
          </main>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          Tasks are saved in your browser automatically.
        </footer>
      </div>
    </div>
  )
}
