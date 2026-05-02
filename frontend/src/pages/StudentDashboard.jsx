import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function StudentDashboard({ supabase, user }) {
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submissionContent, setSubmissionContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const lessonsRes = await fetch(`${API_URL}/lessons`)
      const lessonsData = await lessonsRes.json()
      setLessons(lessonsData)

      const assignmentsRes = await fetch(`${API_URL}/assignments`)
      const assignmentsData = await assignmentsRes.json()
      setAssignments(assignmentsData)

      const submissionsRes = await fetch(`${API_URL}/submissions?student_id=${user.id}`)
      const submissionsData = await submissionsRes.json()
      setSubmissions(submissionsData)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  const handleSubmitAssignment = async (e) => {
    e.preventDefault()
    if (!selectedAssignment) {
      setMessage('Please select an assignment')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: selectedAssignment,
          student_id: user.id,
          content: submissionContent,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit assignment')

      setMessage('Assignment submitted!')
      setSubmissionContent('')
      setSelectedAssignment(null)
      fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const hasSubmitted = (assignmentId) => submissions.some((s) => s.assignment_id === assignmentId)

  return (
    <div>
      <h2>Student Dashboard</h2>
      {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}

      <div className="grid-2">
        {/* Lessons Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Available Lessons</h3>
          <div className="feed">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="card">
                <div className="card-title">{lesson.title}</div>
                <div className="card-subtitle">{lesson.content.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Assignments</h3>

          <div className="feed" style={{ marginBottom: '24px' }}>
            {assignments.map((assignment) => {
              const lesson = lessons.find((l) => l.id === assignment.lesson_id)
              const submitted = hasSubmitted(assignment.id)

              return (
                <div key={assignment.id} className="card">
                  <div className="card-title">{assignment.title}</div>
                  <div className="card-subtitle">{assignment.description}</div>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Lesson: {lesson?.title || 'Unknown'}
                  </small>
                  <div style={{ marginTop: '12px' }}>
                    {submitted ? (
                      <span style={{ color: '#060', fontWeight: '600', fontSize: '12px' }}>✓ Submitted</span>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(assignment.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '8px 12px', width: 'auto' }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedAssignment && (
            <form onSubmit={handleSubmitAssignment} className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h4 style={{ marginBottom: '16px' }}>
                Submit Assignment: {assignments.find((a) => a.id === selectedAssignment)?.title}
              </h4>

              <div className="form-group">
                <label>Your Response</label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Write your response here..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedAssignment(null)
                    setSubmissionContent('')
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
