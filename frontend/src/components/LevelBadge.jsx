export default function LevelBadge({ level }) {
  const getLevelColor = (lvl) => {
    if (lvl < 5) return '#4CAF50'
    if (lvl < 10) return '#2196F3'
    if (lvl < 20) return '#9C27B0'
    return '#FF9800'
  }

  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: getLevelColor(level),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '18px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {level}
    </div>
  )
}
