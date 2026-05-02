import { useState, useEffect } from 'react'
import {
  StatCard,
  ProgressBar,
  AchievementBadge,
} from '../components/GamificationUI'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function TeacherDashboardEnhanced({ supabase, user }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [students, setStudents] = useState([])
  const [assignedTasks, setAssignedTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Lesson creation
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonContent, setLessonContent] = useState('')

  // Assignment creation
  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [assignmentDescription, setAssignmentDescription] = useState('')
  const [assignmentLesson, setAssignmentLesson] = useState('')

  // Task assignment
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])

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
      setAssignments(
        assignmentsData.filter((a) => lessonsData.some((l) => l.id === a.lesson_id))
      )

      const studentsRes = await fetch(`${API_URL}/users?role=student`)
      if (!studentsRes.ok) {
        throw new Error(`Failed to fetch students: ${studentsRes.status}`)
      }
      const studentsData = await studentsRes.json()
      setStudents(studentsData)
      console.log('Students fetched:', studentsData)

      const tasksRes = await fetch(`${API_URL}/assigned_tasks`)
      const tasksData = await tasksRes.json()
      setAssignedTasks(tasksData)
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err)
      setMessage(`Error: ${err.message}`)
    }
  }

  const handleCreateLesson = async (e) => {
    e.preventDefault()
    if (!lessonTitle.trim() || !lessonContent.trim()) {
      setMessage('שם השיעור והתוכן נדרשים')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          teacher_id: user.id,
        }),
      })
      if (!res.ok) throw new Error('Failed to create lesson')

      setLessonTitle('')
      setLessonContent('')
      setMessage('השיעור נוצר בהצלחה! ✓')
      await fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!assignmentTitle.trim() || !assignmentDescription.trim() || !assignmentLesson) {
      setMessage('כל השדות נדרשים')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: assignmentLesson,
          title: assignmentTitle,
          description: assignmentDescription,
        }),
      })
      if (!res.ok) throw new Error('Failed to create assignment')

      setAssignmentTitle('')
      setAssignmentDescription('')
      setAssignmentLesson('')
      setMessage('המטלה נוצרה בהצלחה! ✓')
      await fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTasks = async () => {
    if (!selectedAssignment || selectedStudents.length === 0) {
      setMessage('בחר מטלה ותלמיד אחד לפחות')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/assigned_tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: selectedAssignment,
          student_ids: selectedStudents,
        }),
      })
      if (!res.ok) throw new Error('Failed to assign tasks')

      setSelectedAssignment(null)
      setSelectedStudents([])
      setShowAssignModal(false)
      setMessage('המטלות הוקצו בהצלחה! ✓')
      await fetchData()
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    const totalAssignedTasks = assignedTasks.length
    const completedTasks = assignedTasks.filter((t) => t.status === 'completed').length
    const completionRate = totalAssignedTasks > 0 ? Math.round((completedTasks / totalAssignedTasks) * 100) : 0

    return {
      lessonsCreated: lessons.length,
      totalStudents: students.length,
      totalAssignments: assignments.length,
      completionRate: completionRate,
    }
  }

  const stats = getStats()

  return (
    <div>
      {/* Top Stats */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>📚 לוח בקרה המורה</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <StatCard icon="🎵" label="שיעורים שנוצרו" value={stats.lessonsCreated} color="blue" />
          <StatCard icon="👥" label="סך כל התלמידים" value={stats.totalStudents} color="green" />
          <StatCard icon="📋" label="כל המטלות" value={stats.totalAssignments} color="orange" />
          <StatCard icon="✅" label="שיעור השלמה" value={`${stats.completionRate}%`} color="purple" />
        </div>
      </div>

      {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}

      {/* Tabs */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          style={{ marginRight: '16px' }}
        >
          📊 לוח המחוונים
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
          style={{ marginRight: '16px' }}
        >
          👥 תלמידים ומטלות
        </button>
        <button
          onClick={() => setActiveTab('messaging')}
          className={`nav-item ${activeTab === 'messaging' ? 'active' : ''}`}
          style={{ marginRight: '16px' }}
        >
          💬 הודעות
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <h3>📊 סיכום ביצועים</h3>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-title">התקדמות כיתה</div>
            <ProgressBar
              current={stats.completionRate}
              total={100}
              label="שיעור השלמה של המטלות"
            />
          </div>

          {/* Create Lesson Form */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-title">➕ צור שיעור חדש</div>
            <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="שם השיעור"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <textarea
                placeholder="תוכן השיעור"
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
              />
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'יוצר...' : '✨ צור שיעור'}
              </button>
            </form>
          </div>

          <div className="grid-2">
            <div>
              <h4>🎵 שיעורים אחרונים</h4>
              <div className="feed">
                {lessons.slice(0, 3).map((lesson) => (
                  <div key={lesson.id} className="card">
                    <div className="card-title">{lesson.title}</div>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      {lesson.content.substring(0, 50)}...
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4>🏆 הישגים</h4>
              <div className="feed">
                <AchievementBadge
                  icon="🎵"
                  title="שיעור ראשון"
                  description="יצרת שיעור ראשון"
                  unlocked={lessons.length > 0}
                />
                <AchievementBadge
                  icon="👥"
                  title="בונה כיתה"
                  description="יש לך 5 תלמידים"
                  unlocked={students.length >= 5}
                />
                <AchievementBadge
                  icon="📝"
                  title="אדון המטלות"
                  description="יצרת 10 מטלות"
                  unlocked={assignments.length >= 10}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students & Assignments Tab */}
      {activeTab === 'students' && (
        <div>
          {/* Create Assignment Form */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div className="card-title">➕ צור מטלה חדשה</div>
            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="שם המטלה"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <textarea
                placeholder="תיאור המטלה"
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '60px',
                  fontFamily: 'inherit',
                }}
              />
              <select
                value={assignmentLesson}
                onChange={(e) => setAssignmentLesson(e.target.value)}
                style={{
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="">בחר שיעור...</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'יוצר...' : '✨ צור מטלה'}
              </button>
            </form>
          </div>

          <h3>👥 רשימת תלמידים</h3>
          <div className="feed" style={{ marginBottom: '32px' }}>
            {students.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>אין תלמידים עדיין</p>
            ) : (
              students.map((student) => {
                const studentTasks = assignedTasks.filter((t) => t.student_id === student.id)
                const completedTasks = studentTasks.filter((t) => t.status === 'completed').length

                return (
                  <div key={student.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="card-title">{student.email}</div>
                        <small style={{ color: 'var(--text-secondary)' }}>
                          מטלות מוקצה: {studentTasks.length} | הושלם: {completedTasks}
                        </small>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                          הוקד מטלות
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                          הודעה
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <h3>📋 כל המטלות שלי</h3>
          <div className="feed">
            {assignments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>אין מטלות עדיין</p>
            ) : (
              assignments.map((assignment) => {
                const taskCount = assignedTasks.filter((t) => t.assignment_id === assignment.id).length

                return (
                  <div key={assignment.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="card-title">{assignment.title}</div>
                        <div className="card-subtitle">{assignment.description}</div>
                        <small style={{ color: 'var(--text-secondary)' }}>
                          מוקצה ל-{taskCount} תלמידים
                        </small>
                      </div>
                      <button
                        className="btn"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                        onClick={() => {
                          setSelectedAssignment(assignment.id)
                          setShowAssignModal(true)
                        }}
                      >
                        הוקד עוד
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Assign Tasks Modal */}
          {showAssignModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                className="card"
                style={{
                  width: '90%',
                  maxWidth: '500px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  padding: '20px',
                }}
              >
                <div className="card-title" style={{ marginBottom: '16px' }}>
                  הוקד מטלה לתלמידים
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    בחר תלמידים:
                  </label>
                  <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px' }}>
                    {students.map((student) => (
                      <label
                        key={student.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: selectedStudents.includes(student.id) ? 'var(--bg-secondary)' : 'transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id])
                            } else {
                              setSelectedStudents(selectedStudents.filter((id) => id !== student.id))
                            }
                          }}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                        />
                        <span>{student.email}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn"
                    style={{ flex: 1 }}
                    onClick={handleAssignTasks}
                    disabled={loading}
                  >
                    {loading ? 'מוקצה...' : '✓ הוקד'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setShowAssignModal(false)
                      setSelectedStudents([])
                    }}
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messaging Tab */}
      {activeTab === 'messaging' && (
        <div>
          <h3>💬 הודעות</h3>
          <div style={{ marginBottom: '24px' }}>
            <button className="btn" style={{ marginBottom: '16px' }}>
              + שלח הודעה חדשה
            </button>
          </div>
          <div className="card">
            <div className="card-title">השלח הודעה ל:</div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label>
                  <input type="radio" name="messageType" value="single" defaultChecked /> לתלמיד יחיד
                </label>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>
                  <input type="radio" name="messageType" value="multiple" /> לקבוצת תלמידים
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>בחר תלמיד(ים)</label>
              <select
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option>בחר תלמיד...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>ההודעה שלך</label>
              <textarea
                placeholder="כתוב את ההודעה שלך כאן..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '120px',
                }}
              />
            </div>

            <button className="btn" style={{ width: '100%' }}>
              🚀 שלח הודעה
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
