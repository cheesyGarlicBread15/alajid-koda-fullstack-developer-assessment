// Typed API client for the Client Project Tracker backend.

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed'
export type ProjectPriority = 'low' | 'medium' | 'high'

export interface Project {
  id: number
  client_name: string
  project_name: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  start_date: string
  due_date: string
  created_at: string
  updated_at: string
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ProjectFormData {
  client_name: string
  project_name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  start_date: string
  due_date: string
}

/** Laravel validation error bag: field name -> list of messages. */
export type ValidationErrors = Record<string, string[]>

/** Thrown for any non-2xx response, carrying the parsed error payload. */
export class ApiError extends Error {
  status: number
  errors: ValidationErrors

  constructor(message: string, status: number, errors: ValidationErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

// Defaults to the relative "/api" path (handled by the Vite dev proxy).
// Set VITE_API_URL to call the backend cross-origin (relies on backend CORS).
const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string
      errors?: ValidationErrors
    }
    throw new ApiError(
      body.message ?? 'Request failed',
      response.status,
      body.errors ?? {},
    )
  }

  return (await response.json()) as T
}

export interface ProjectQuery {
  search?: string
  status?: ProjectStatus | ''
  priority?: ProjectPriority | ''
  sort?: string
  direction?: 'asc' | 'desc'
}

export function fetchProjects(query: ProjectQuery = {}): Promise<Paginated<Project>> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.append(key, String(value))
    }
  }
  const qs = params.toString()
  return request<Paginated<Project>>(`/projects${qs ? `?${qs}` : ''}`)
}

export function createProject(data: ProjectFormData): Promise<Project> {
  return request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

export const PRIORITY_OPTIONS: { value: ProjectPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]
