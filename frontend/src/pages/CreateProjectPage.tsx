import { Link, useNavigate } from 'react-router-dom'
import { ProjectForm } from '../components/ProjectForm.tsx'

export default function CreateProjectPage() {
  const navigate = useNavigate()

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>New Project</h2>
        <Link to="/" className="button-link ghost">
          Back to projects
        </Link>
      </div>

      {/* On a successful create, return to the listing (which re-fetches on mount). */}
      <ProjectForm onCreated={() => navigate('/')} />
    </section>
  )
}
