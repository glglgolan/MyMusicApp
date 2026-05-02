import { useState, useEffect } from 'react'
import '../styles/gamification.css'

// ==================== Progress Bar ====================
export function ProgressBar({ current, total, label = 'Progress' }) {
  const percentage = (current / total) * 100

  return (
    <div className="progress-container">
      <div className="progress-label">{label}</div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          <span className="progress-text">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  )
}

// ==================== Points Badge ====================
export function PointsBadge({ points = 0, animated = false }) {
  const [displayPoints, setDisplayPoints] = useState(0)

  useEffect(() => {
    if (animated && points > displayPoints) {
      const interval = setInterval(() => {
        setDisplayPoints((prev) => {
          const next = prev + Math.ceil((points - prev) / 10)
          return next >= points ? points : next
        })
      }, 30)
      return () => clearInterval(interval)
    } else {
      setDisplayPoints(points)
    }
  }, [points, animated, displayPoints])

  return (
    <div className="points-badge">
      <span className="points-icon">⭐</span>
      <span className="points-value">{displayPoints}</span>
      <span className="points-label">XP</span>
    </div>
  )
}

// ==================== Streak Counter ====================
export function StreakCounter({ days = 0, isActive = true }) {
  return (
    <div className={`streak-counter ${isActive ? 'active' : ''}`}>
      <span className="streak-icon">🔥</span>
      <div className="streak-info">
        <span className="streak-number">{days}</span>
        <span className="streak-label">Day Streak</span>
      </div>
    </div>
  )
}

// ==================== Achievement Badge ====================
export function AchievementBadge({ icon, title, description, unlocked = false }) {
  return (
    <div className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon">{icon}</div>
      <div className="achievement-info">
        <div className="achievement-title">{title}</div>
        <div className="achievement-desc">{description}</div>
      </div>
      {unlocked && <div className="achievement-check">✓</div>}
    </div>
  )
}

// ==================== Level Card ====================
export function LevelCard({ level, title, completed = false, onClick }) {
  return (
    <div
      className={`level-card ${completed ? 'completed' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="level-number">{level}</div>
      <div className="level-title">{title}</div>
      {completed && <div className="level-checkmark">✓</div>}
    </div>
  )
}

// ==================== Confetti Animation ====================
export function ConfettiCelebration({ trigger = false }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  if (!showConfetti) return null

  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: Math.random() * 100 + '%',
            delay: Math.random() * 0.5 + 's',
            backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][i % 4],
          }}
        />
      ))}
    </div>
  )
}

// ==================== Motivational Quote ====================
export function MotivationalQuote() {
  const quotes = [
    '🌟 Keep it up! You\'re doing great!',
    '🎵 Every lesson brings you closer to mastery!',
    '💪 Consistency is the key to success!',
    '🚀 You\'re on fire! Keep going!',
    '⭐ One step at a time, you\'re getting there!',
    '🎯 Focus on progress, not perfection!',
  ]

  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return <div className="motivational-quote">{quote}</div>
}

// ==================== Interactive Lesson Card ====================
export function InteractiveLessonCard({ lesson, onStart, completed = false }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`interactive-lesson-card ${completed ? 'completed' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="lesson-emoji">🎵</div>
      <div className="lesson-content">
        <h3 className="lesson-title">{lesson.title}</h3>
        <p className="lesson-desc">{lesson.content.substring(0, 60)}...</p>
      </div>
      {hovered && (
        <button className="lesson-cta-button" onClick={onStart}>
          {completed ? 'Review' : 'Start →'}
        </button>
      )}
      {completed && <div className="lesson-completed-badge">✓ Completed</div>}
    </div>
  )
}

// ==================== Star Rating ====================
export function StarRating({ rating = 0, onRate, interactive = false, size = 'md' }) {
  const [hoveredStar, setHoveredStar] = useState(0)

  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <div className={`star-rating star-rating-${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoveredStar || rating) ? 'filled' : ''}`}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHoveredStar(star)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ==================== Stat Card ====================
export function StatCard({ icon, label, value, color = 'blue' }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}

// ==================== Assignment Progress ====================
export function AssignmentProgress({ completed, total }) {
  const percentage = (completed / total) * 100

  return (
    <div className="assignment-progress">
      <div className="progress-header">
        <span>Assignments</span>
        <span className="progress-count">
          {completed}/{total}
        </span>
      </div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className="progress-animation">{percentage === 100 && '🎉 All done!'}</div>
    </div>
  )
}
