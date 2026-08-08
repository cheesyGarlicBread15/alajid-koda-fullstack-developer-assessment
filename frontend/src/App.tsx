import { useCallback, useEffect, useState } from 'react'
import {
  fetchProjects,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Project,
  type ProjectQuery,
} from './api.ts'
import { ProjectForm } from './components/ProjectForm.tsx'
import { ProjectList } from './components/ProjectList.tsx'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'created_at:desc', label: 'Newest first' },
  { value: 'due_date:asc', label: 'Due date (soonest)' },
  { value: 'due_date:desc', label: 'Due date (latest)' },
  { value: 'client_name:asc', label: 'Client (A–Z)' },
]

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState<ProjectQuery>({
    sort: 'created_at',
    direction: 'desc',
  })

  // Debounce: only push the search box into the query 350ms after typing stops.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchInput }))
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchProjects(query, signal)
        setProjects(result.data)
        setLoading(false)
      } catch (err) {
        // Superseded request was aborted — let the newer request own the state.
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setError('Failed to load projects. Is the backend running?')
        setLoading(false)
      }
    },
    [query],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  function updateQuery<K extends keyof ProjectQuery>(key: K, value: ProjectQuery[K]) {
    setQuery((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Client Project Tracker</h1>
        <p className="muted">Track client projects, status, and priorities.</p>
      </header>

      <section className="panel">
        <h2>New Project</h2>
        <ProjectForm onCreated={load} />
      </section>

      <section className="panel">
        <div className="filters">
          <input
            type="search"
            placeholder="Search client or project…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <select
            value={query.status ?? ''}
            onChange={(e) => updateQuery('status', e.target.value as ProjectQuery['status'])}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={query.priority ?? ''}
            onChange={(e) => updateQuery('priority', e.target.value as ProjectQuery['priority'])}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={`${query.sort}:${query.direction}`}
            onChange={(e) => {
              const [sort, direction] = e.target.value.split(':')
              setQuery((prev) => ({
                ...prev,
                sort,
                direction: direction as ProjectQuery['direction'],
              }))
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <ProjectList projects={projects} loading={loading} error={error} />
      </section>
    </div>
  )
}
