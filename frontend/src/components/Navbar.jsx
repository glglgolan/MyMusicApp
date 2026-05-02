import { useGamificationAPI } from '../hooks/useGamificationAPI'
import LevelBadge from './LevelBadge'
import XPBar from './XPBar'

export default function Navbar({ user, role, onLogout, onNavigate, currentPage }) {
  const { profile } = useGamificationAPI(user?.id)

  return (
    <nav className="navbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        🎵 Music Learning
      </div>

      <div className="navbar-nav">
        <button
          className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>

        {role === 'teacher' && (
          <button
            className={`nav-item ${currentPage === 'teacher' ? 'active' : ''}`}
            onClick={() => onNavigate('teacher')}
          >
            Dashboard
          </button>
        )}

        {role === 'student' && (
          <button
            className={`nav-item ${currentPage === 'student' ? 'active' : ''}`}
            onClick={() => onNavigate('student')}
          >
            Dashboard
          </button>
        )}
      </div>

      {/* Gamification Stats */}
      {user && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LevelBadge level={profile.level} />
            <div style={{ width: '100px' }}>
              <XPBar xp={profile.xp} level={profile.level} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {user?.email}
            </span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
