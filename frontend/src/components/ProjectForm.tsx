import { useState, type FormEvent } from 'react'
import {
  ApiError,
  createProject,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type ProjectFormData,
  type ValidationErrors,
} from '../api.ts'

const EMPTY: ProjectFormData = {
  client_name: '',
  project_name: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  start_date: '',
  due_date: '',
}

export function ProjectForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})
    setGeneralError(null)

    try {
      await createProject(form)
      setForm(EMPTY)
      onCreated()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.errors)
        if (error.status !== 422) {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit} noValidate>
      {generalError && <p className="error">{generalError}</p>}

      <div className="field">
        <label htmlFor="client_name">Client Name</label>
        <input
          id="client_name"
          value={form.client_name}
          onChange={(e) => update('client_name', e.target.value)}
        />
        {errors.client_name && <span className="field-error">{errors.client_name[0]}</span>}
      </div>

      <div className="field">
        <label htmlFor="project_name">Project Name</label>
        <input
          id="project_name"
          value={form.project_name}
          onChange={(e) => update('project_name', e.target.value)}
        />
        {errors.project_name && <span className="field-error">{errors.project_name[0]}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
        {errors.description && <span className="field-error">{errors.description[0]}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update('status', e.target.value as ProjectFormData['status'])}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && <span className="field-error">{errors.status[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => update('priority', e.target.value as ProjectFormData['priority'])}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.priority && <span className="field-error">{errors.priority[0]}</span>}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="start_date">Start Date</label>
          <input
            id="start_date"
            type="date"
            value={form.start_date}
            onChange={(e) => update('start_date', e.target.value)}
          />
          {errors.start_date && <span className="field-error">{errors.start_date[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="due_date">Due Date</label>
          <input
            id="due_date"
            type="date"
            value={form.due_date}
            onChange={(e) => update('due_date', e.target.value)}
          />
          {errors.due_date && <span className="field-error">{errors.due_date[0]}</span>}
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Create Project'}
      </button>
    </form>
  )
}
