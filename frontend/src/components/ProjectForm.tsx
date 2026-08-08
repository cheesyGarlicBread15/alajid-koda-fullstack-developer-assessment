import { useState, type FormEvent } from 'react'
import { format, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  ApiError,
  createProject,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type ProjectFormData,
  type ProjectPriority,
  type ProjectStatus,
  type ValidationErrors,
} from '../api.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EMPTY: ProjectFormData = {
  client_name: '',
  project_name: '',
  description: '',
  status: 'planning',
  priority: 'medium',
  start_date: '',
  due_date: '',
}

const DATE_FORMAT = 'yyyy-MM-dd'

// The backend contract uses "yyyy-MM-dd" strings; the Calendar works in Date.
const toDate = (value: string): Date | undefined =>
  value ? parse(value, DATE_FORMAT, new Date()) : undefined

const toIsoDate = (date: Date | undefined): string =>
  date ? format(date, DATE_FORMAT) : ''

export function ProjectForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [dueOpen, setDueOpen] = useState(false)

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
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        {generalError && (
          <p className="text-sm font-medium text-destructive">{generalError}</p>
        )}

        <Field data-invalid={!!errors.client_name}>
          <FieldLabel htmlFor="client_name">Client Name</FieldLabel>
          <Input
            id="client_name"
            value={form.client_name}
            aria-invalid={!!errors.client_name}
            onChange={(e) => update('client_name', e.target.value)}
          />
          <FieldError>{errors.client_name?.[0]}</FieldError>
        </Field>

        <Field data-invalid={!!errors.project_name}>
          <FieldLabel htmlFor="project_name">Project Name</FieldLabel>
          <Input
            id="project_name"
            value={form.project_name}
            aria-invalid={!!errors.project_name}
            onChange={(e) => update('project_name', e.target.value)}
          />
          <FieldError>{errors.project_name?.[0]}</FieldError>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            rows={3}
            value={form.description}
            aria-invalid={!!errors.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <FieldError>{errors.description?.[0]}</FieldError>
        </Field>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select
              items={STATUS_OPTIONS}
              value={form.status}
              onValueChange={(value) => update('status', value as ProjectStatus)}
            >
              <SelectTrigger id="status" className="w-full" aria-invalid={!!errors.status}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.status?.[0]}</FieldError>
          </Field>

          <Field data-invalid={!!errors.priority}>
            <FieldLabel htmlFor="priority">Priority</FieldLabel>
            <Select
              items={PRIORITY_OPTIONS}
              value={form.priority}
              onValueChange={(value) => update('priority', value as ProjectPriority)}
            >
              <SelectTrigger id="priority" className="w-full" aria-invalid={!!errors.priority}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.priority?.[0]}</FieldError>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field data-invalid={!!errors.start_date}>
            <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
            <Popover open={startOpen} onOpenChange={setStartOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="start_date"
                    type="button"
                    variant="outline"
                    aria-invalid={!!errors.start_date}
                    className={cn(
                      'w-full justify-start font-normal',
                      !form.start_date && 'text-muted-foreground',
                    )}
                  />
                }
              >
                <CalendarIcon />
                {form.start_date
                  ? format(toDate(form.start_date)!, 'PPP')
                  : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate(form.start_date)}
                  onSelect={(date) => {
                    update('start_date', toIsoDate(date))
                    setStartOpen(false)
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError>{errors.start_date?.[0]}</FieldError>
          </Field>

          <Field data-invalid={!!errors.due_date}>
            <FieldLabel htmlFor="due_date">Due Date</FieldLabel>
            <Popover open={dueOpen} onOpenChange={setDueOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="due_date"
                    type="button"
                    variant="outline"
                    aria-invalid={!!errors.due_date}
                    className={cn(
                      'w-full justify-start font-normal',
                      !form.due_date && 'text-muted-foreground',
                    )}
                  />
                }
              >
                <CalendarIcon />
                {form.due_date
                  ? format(toDate(form.due_date)!, 'PPP')
                  : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate(form.due_date)}
                  onSelect={(date) => {
                    update('due_date', toIsoDate(date))
                    setDueOpen(false)
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError>{errors.due_date?.[0]}</FieldError>
          </Field>
        </div>

        <Field orientation="horizontal">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Create Project'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
