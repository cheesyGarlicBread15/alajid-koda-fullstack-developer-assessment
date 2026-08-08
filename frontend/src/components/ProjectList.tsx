import { PRIORITY_OPTIONS, STATUS_OPTIONS, type Project } from '../api.ts'

const statusLabel = (value: string) =>
  STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value

const priorityLabel = (value: string) =>
  PRIORITY_OPTIONS.find((option) => option.value === value)?.label ?? value

const formatDate = (iso: string) => new Date(iso).toLocaleDateString()

export function ProjectList({
  projects,
  loading,
  error,
}: {
  projects: Project[]
  loading: boolean
  error: string | null
}) {
  if (loading) {
    return <p className="muted">Loading projects…</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (projects.length === 0) {
    return <p className="muted">No projects found.</p>
  }

  return (
    <div className="table-wrapper">
      <table className="projects">
        <thead>
          <tr>
            <th>Client</th>
            <th>Project</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Start</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.client_name}</td>
              <td>{project.project_name}</td>
              <td>
                <span className={`badge status-${project.status}`}>
                  {statusLabel(project.status)}
                </span>
              </td>
              <td>
                <span className={`badge priority-${project.priority}`}>
                  {priorityLabel(project.priority)}
                </span>
              </td>
              <td>{formatDate(project.start_date)}</td>
              <td>{formatDate(project.due_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
