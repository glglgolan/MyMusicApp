import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function TeacherDashboard({ supabase, user }) {
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const lessonsRes = await fetch(`${API_URL}/lessons?teacher_id=${user.id}`)
      const lessonsData = await lessonsRes.json()
      setLessons(lessonsData)

      const assignmentsRes = await fetch(`${API_URL}/assignments`)
      const assignmentsData = await assignmentsRes.json()
      setAssignments(assignmentsData.filter((a) => lessonsData.some((l) => l.id === a.lesson_id)))
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleCreateLesson = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: user.id,
          title: formData.title,
          content: formData.content,
        }),
      })

      if (!res.ok) throw new Error('Failed to create lesson')

      setMessage('Lesson created!')
      setFormData({ title: '', content: '', description: '' })
      setShowLessonForm(false)
      fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!selectedLesson) {
      setMessage('Please select a lesson')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: selectedLesson,
          title: formData.title,
          description: formData.description,
        }),
      })

      if (!res.ok) throw new Error('Failed to create assignment')

      setMessage('Assignment created!')
      setFormData({ title: '', content: '', description: '' })
      setShowAssignmentForm(false)
      setSelectedLesson(null)
      fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}

      <div className="grid-2">
        {/* Lessons Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>My Lessons</h3>
          {!showLessonForm && (
            <button
              onClick={() => setShowLessonForm(true)}
              className="btn"
              style={{ marginBottom: '16px' }}
            >
              + Create Lesson
            </button>
          )}

          {showLessonForm && (
            <form onSubmit={handleCreateLesson} className="card">
              <div className="form-group">
                <label>Lesson Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLessonForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="feed">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="card">
                <div className="card-title">{lesson.title}</div>
                <div className="card-subtitle">{lesson.content.substring(0, 100)}...</div>
                <small style={{ color: 'var(--text-secondary)' }}>
                  {new Date(lesson.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Assignments</h3>
          {!showAssignmentForm && (
            <button
              onClick={() => setShowAssignmentForm(true)}
              className="btn"
              style={{ marginBottom: '16px' }}
            >
              + Create Assignment
            </button>
          )}

          {showAssignmentForm && (
            <form onSubmit={handleCreateAssignment} className="card">
              <div className="form-group">
                <label>Select Lesson</label>
                <select
                  value={selectedLesson || ''}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Choose a lesson...</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAssignmentForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="feed">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card">
                <div className="card-title">{assignment.title}</div>
                <div className="card-subtitle">{assignment.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
