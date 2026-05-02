export default function StreakIndicator({ streak }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        color: streak > 0 ? '#FF9800' : 'var(--text-secondary)',
      }}
    >
      <span style={{ fontSize: '16px' }}>🔥</span>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  )
}
