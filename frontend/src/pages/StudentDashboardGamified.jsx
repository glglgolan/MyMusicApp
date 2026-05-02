import { useState, useEffect } from 'react'
import useGamification from '../hooks/useGamification'
import {
  PointsBadge,
  StreakCounter,
  ProgressBar,
  InteractiveLessonCard,
  AssignmentProgress,
  ConfettiCelebration,
  MotivationalQuote,
  StatCard,
  StarRating,
} from '../components/GamificationUI'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function StudentDashboardGamified({ supabase, user }) {
  const gamification = useGamification(user.id)
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

      setMessage('Assignment submitted! 🎉')
      setSubmissionContent('')
      setSelectedAssignment(null)
      gamification.submitAssignment() // Award points
      fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonStart = (lessonId) => {
    gamification.completeLesson() // Award points & update streak
    setMessage('Great job! Keep up the streak! 🔥')
  }

  const levelInfo = gamification.getLevelInfo()
  const hasSubmitted = (assignmentId) => submissions.some((s) => s.assignment_id === assignmentId)

  return (
    <div>
      {/* Celebration Animation */}
      <ConfettiCelebration trigger={gamification.showCelebration} />

      {/* Top Header with Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>🎵 Learning Dashboard</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
          }}
        >
          <PointsBadge points={gamification.stats.points} animated />
          <StreakCounter days={gamification.stats.streak} isActive={gamification.stats.streak > 0} />
          <StatCard icon="📊" label="Level" value={gamification.stats.level} color="purple" />
          <StatCard icon="🏆" label="Completed" value={gamification.stats.totalLessonsCompleted} color="green" />
        </div>
      </div>

      {/* Messages */}
      {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}

      {/* Level Progress */}
      <div style={{ marginBottom: '32px' }}>
        <ProgressBar
          current={levelInfo.currentPoints}
          total={levelInfo.totalPoints}
          label={`Level ${levelInfo.current} Progress`}
        />
      </div>

      {/* Motivational Quote */}
      <MotivationalQuote />

      {/* Assignment Progress */}
      <div style={{ marginBottom: '32px' }}>
        <AssignmentProgress
          completed={gamification.stats.assignmentsSubmitted}
          total={assignments.length || 1}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid-2">
        {/* Lessons Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>📚 Available Lessons</h3>
          {lessons.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No lessons available yet.</p>
          ) : (
            <div className="feed">
              {lessons.map((lesson) => (
                <InteractiveLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={() => handleLessonStart(lesson.id)}
                  completed={gamification.stats.totalLessonsCompleted > 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Assignments Section */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>✏️ Assignments</h3>

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
                      <span style={{ color: '#060', fontWeight: '600', fontSize: '12px' }}>
                        ✓ Submitted
                      </span>
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
            <form
              onSubmit={handleSubmitAssignment}
              className="card"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <h4 style={{ marginBottom: '16px' }}>
                ✍️ Submit Assignment: {assignments.find((a) => a.id === selectedAssignment)?.title}
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

              <div className="form-group">
                <label>Rate Your Effort (optional)</label>
                <StarRating rating={0} interactive onRate={() => {}} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Submitting...' : '🚀 Submit & Earn Points'}
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

      {/* Recent Activity */}
      {gamification.recentActivity.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3>📊 Recent Activity</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {gamification.recentActivity.map((activity, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              >
                {activity.type === 'points' && (
                  <span>
                    ⭐ +{activity.amount} XP for {activity.reason.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {gamification.stats.achievements.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3>🏆 Achievements Unlocked</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {gamification.stats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #FFE5B4, #FFDAB9)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{achievement.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>{achievement.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  +{achievement.points} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          background: 'linear-gradient(135deg, #E3F2FD, #F3E5F5)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <h4>💡 Tips to Earn More Points</h4>
        <ul style={{ marginLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <li>Complete lessons daily to maintain your streak 🔥</li>
          <li>Submit assignments to earn extra points 📝</li>
          <li>Reach level 5 to unlock exclusive badges ⭐</li>
          <li>Challenge yourself with harder lessons 🚀</li>
        </ul>
      </div>
    </div>
  )
}
