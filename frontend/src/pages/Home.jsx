import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Home({ supabase, user, role }) {
  const [lessons, setLessons] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Teachers go to dashboard, skip home feed
        if (role === 'teacher') {
          setLoading(false)
          return
        }

        // Fetch all lessons
        const lessonsRes = await fetch(`${API_URL}/lessons`)
        const lessonsData = await lessonsRes.json()
        setLessons(lessonsData)

        // Fetch teachers
        const teachersRes = await fetch(`${API_URL}/users?role=teacher`)
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [role])

  if (loading) {
    return <div className="loading">Loading lessons...</div>
  }

  if (role === 'teacher') {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Welcome back, Teacher!</h2>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <p style={{ marginBottom: '12px' }}>Go to your dashboard to manage lessons, assignments, and students.</p>
          <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
            📊 Go to Teacher Dashboard →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Welcome to Music Learning</h2>

      <div style={{ marginBottom: '32px' }}>
        <h3>Available Lessons</h3>
        {lessons.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No lessons available yet.</p>
        ) : (
          <div className="feed">
            {lessons.map((lesson) => {
              const teacher = teachers.find((t) => t.id === lesson.teacher_id)
              return (
                <div key={lesson.id} className="post">
                  <div className="post-header">
                    <span className="post-author">{teacher?.email || 'Unknown Teacher'}</span>
                    <span className="post-date">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="post-title">{lesson.title}</h3>
                  <div className="post-content">{lesson.content}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {role === 'student' && (
        <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <p style={{ marginBottom: '12px' }}>View your assignments and lessons</p>
          <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
            Go to Student Dashboard →
          </a>
        </div>
      )}
    </div>
  )
}
