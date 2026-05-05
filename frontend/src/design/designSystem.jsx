// Design system from Melodia handoff
// Colors, gradients, and component library

// Global color variables
export const C = {
  primary: '#7C3AED',
  primaryLight: '#EDE9FE',
  blue: '#2563EB',
  blueLight: '#EFF6FF',
  teal: '#0D9488',
  tealLight: '#F0FDFA',
  gold: '#D97706',
  goldLight: '#FEF3C7',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  orange: '#F97316',
  orangeLight: '#FFEDD5',
  bg: '#F0F1F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  border: '#E2E8F0',
  text: '#111827',
  textMuted: '#6B7280',
  textSub: '#9CA3AF',
};

// Global gradient variables
export const G = {
  primary: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
  blue: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
  teal: 'linear-gradient(135deg,#0D9488,#0F766E)',
  gold: 'linear-gradient(135deg,#D97706,#B45309)',
  green: 'linear-gradient(135deg,#10B981,#059669)',
  fire: 'linear-gradient(135deg,#F97316,#EA580C)',
  ocean: 'linear-gradient(135deg,#2563EB,#7C3AED)',
  sunset: 'linear-gradient(135deg,#F97316,#D97706)',
};

// Button component with multiple variants
export function Btn({
  variant = 'primary',
  size = 'md',
  full = false,
  icon,
  onClick,
  children,
  disabled = false,
  style,
  ...props
}) {
  const variantStyles = {
    primary: {
      background: G.primary,
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: C.surface,
      color: C.text,
      border: `1.5px solid ${C.border}`,
    },
    gold: {
      background: G.gold,
      color: 'white',
      border: 'none',
    },
    fire: {
      background: G.fire,
      color: 'white',
      border: 'none',
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '8px' },
    md: { padding: '10px 18px', fontSize: '14px', borderRadius: '12px' },
    lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '14px' },
  };

  const buttonStyle = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: disabled ? 'default' : 'pointer',
    width: full ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? 8 : 0,
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.15s',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// Card component
export function Card({
  children,
  padding = '20px',
  style,
  ...props
}) {
  return (
    <div
      style={{
        background: C.surface,
        borderRadius: '16px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// XP Progress Bar
export function XPBar({ xp, maxXp, level }) {
  const percentage = (xp / maxXp) * 100;
  return (
    <div>
      <div
        style={{
          height: '6px',
          background: C.bg,
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '4px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: G.primary,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: C.textMuted,
          fontWeight: 600,
        }}
      >
        <span>Level {level}</span>
        <span>
          {xp} / {maxXp}
        </span>
      </div>
    </div>
  );
}

// Level Ring (circular progress)
export function LevelRing({ level, xp, maxXp, size = 80 }) {
  const percentage = (xp / maxXp) * 100;
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.bg}
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.primary}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: size * 0.35,
            fontWeight: 800,
            color: C.primary,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {level}
        </div>
        <div
          style={{
            fontSize: size * 0.18,
            color: C.textMuted,
            fontWeight: 600,
          }}
        >
          Level
        </div>
      </div>
    </div>
  );
}

// Streak Badge
export function StreakBadge({ streak }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: '999px',
        background: G.fire,
        color: 'white',
        fontSize: '12px',
        fontWeight: 700,
      }}
    >
      <span>🔥</span>
      <span>{streak} day streak</span>
    </div>
  );
}

// Music Staff Component (simplified)
export function MusicStaff({ activeNote = -1, notes = [] }) {
  const staffLines = 5;
  const lineHeight = 20;
  const padding = 40;
  const width = 400;
  const height = staffLines * lineHeight + padding * 2;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '500px' }}
    >
      {/* Staff lines */}
      {Array.from({ length: staffLines }).map((_, i) => (
        <line
          key={`line-${i}`}
          x1="30"
          y1={padding + i * lineHeight}
          x2={width - 30}
          y2={padding + i * lineHeight}
          stroke={C.border}
          strokeWidth="1"
        />
      ))}

      {/* Treble clef */}
      <text
        x="50"
        y={padding + 40}
        fontSize="40"
        fill={C.text}
        fontFamily="serif"
      >
        𝄞
      </text>
    </svg>
  );
}

// Avatar SVG Component
export function AvatarSVG({
  instrument = 'guitar',
  size = 120,
  style,
}) {
  const instrumentEmojis = {
    guitar: '🎸',
    piano: '🎹',
    violin: '🎻',
    drums: '🥁',
    trumpet: '🎺',
    flute: '🪈',
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.7,
        ...style,
      }}
    >
      {instrumentEmojis[instrument] || '🎵'}
    </div>
  );
}

// Chat Bubble
export function ChatBubble({ text, sent, time, initial }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: sent ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 8,
        direction: 'ltr',
      }}
    >
      {!sent && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: G.primary,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
      )}

      <div
        style={{
          maxWidth: '70%',
          padding: '10px 14px',
          borderRadius: '14px',
          background: sent ? C.primary : C.bg,
          color: sent ? 'white' : C.text,
          fontSize: '13px',
          lineHeight: '1.4',
          wordBreak: 'break-word',
        }}
      >
        {text}
        <div
          style={{
            fontSize: '11px',
            opacity: 0.7,
            marginTop: '4px',
            direction: 'ltr',
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

// Input Field
export function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  rtl = true,
  style,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '11px 14px',
        border: `1.5px solid ${C.border}`,
        borderRadius: '12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        direction: rtl ? 'rtl' : 'ltr',
        boxSizing: 'border-box',
        transition: 'all 0.15s',
        ':focus': {
          borderColor: C.primary,
          boxShadow: `0 0 0 3px rgba(124,58,237,0.12)`,
        },
        ...style,
      }}
      {...props}
    />
  );
}
