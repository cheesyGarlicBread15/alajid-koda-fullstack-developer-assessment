import { Link, Route, Routes } from 'react-router-dom'
import ProjectsPage from './pages/ProjectsPage.tsx'
import CreateProjectPage from './pages/CreateProjectPage.tsx'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <Link to="/" className="title-link">
            Client Project Tracker
          </Link>
        </h1>
        <p className="muted">Track client projects, status, and priorities.</p>
      </header>

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
      </Routes>
    </div>
  )
}
