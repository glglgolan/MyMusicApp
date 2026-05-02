export default function XPBar({ xp, level }) {
  const xpPerLevel = 100
  const currentLevelXP = xp % xpPerLevel
  const progressPercent = (currentLevelXP / xpPerLevel) * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          XP: {currentLevelXP}/{xpPerLevel}
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
