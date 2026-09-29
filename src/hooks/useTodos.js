import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'taskly.todos.v1'

const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
}

/** Shape every todo is normalised to before it enters state. */
function normalise(raw) {
  return {
    id: String(raw.id),
    title: String(raw.title ?? '').trim(),
    notes: String(raw.notes ?? ''),
    completed: Boolean(raw.completed),
    createdAt: Number(raw.createdAt) || Date.now(),
  }
}

function readStoredTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((t) => t && t.title).map(normalise)
  } catch {
    // Corrupt or unavailable storage should never block the app from loading.
    return []
  }
}

/** Generate ids that stay unique even if several are created in the same ms. */
let idCounter = 0
function createId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`
}

export function useTodos() {
  const [todos, setTodos] = useState(readStoredTodos)
  const [filter, setFilter] = useState(FILTERS.all)
  const [query, setQuery] = useState('')

  // Persist on every change so a refresh never loses work.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // Storage full or blocked (private mode) — the app still works in-memory.
    }
  }, [todos])

  const addTodo = useCallback((title, notes = '') => {
    const cleanTitle = title.trim()
    if (!cleanTitle) return null

    const todo = normalise({
      id: createId(),
      title: cleanTitle,
      notes,
      completed: false,
      createdAt: Date.now(),
    })

    setTodos((prev) => [todo, ...prev])
    return todo.id
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const updateNotes = useCallback((id, notes) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, notes } : todo)),
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [])

  const counts = {
    total: todos.length,
    completed: todos.reduce((sum, todo) => sum + (todo.completed ? 1 : 0), 0),
  }
  counts.active = counts.total - counts.completed

  // Apply the status filter, then the text search (title + notes).
  const visibleTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === FILTERS.all ||
      (filter === FILTERS.active && !todo.completed) ||
      (filter === FILTERS.completed && todo.completed)

    if (!matchesFilter) return false

    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return (
      todo.title.toLowerCase().includes(needle) ||
      todo.notes.toLowerCase().includes(needle)
    )
  })

  return {
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
  }
}
