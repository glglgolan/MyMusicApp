import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import {
  C,
  G,
  Btn,
  Card,
  XPBar,
  LevelRing,
  StreakBadge,
} from '../design/designSystem';

export function StudentDashboardMelodia({ navigate, user }) {
  const [stats, setStats] = useState({
    xp: 0,
    streak: 0,
    level: 1,
    maxXp: 500,
  });
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch gamification stats
        const { data: stats } = await supabase
          .from('gamification_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (stats) {
          const level = Math.floor(stats.xp / 500) + 1;
          const maxXp = level * 500;
          setStats({
            xp: stats.xp || 0,
            streak: stats.streak || 0,
            level,
            maxXp,
          });
        }

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .limit(4);

        setLessons(lessonsData || []);

        // Fetch assignments for this student
        const { data: assignmentsData } = await supabase
          .from('assigned_tasks')
          .select('*, tasks(title, description)')
          .eq('user_id', user.id);

        setAssignments(assignmentsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          fontSize: '16px',
          color: C.textMuted,
        }}
      >
        ⏳ טוען...
      </div>
    );
  }

  const achievementData = [
    { emoji: '🔥', title: 'לוחם שבועי', desc: '7 ימי רצף', unlocked: stats.streak >= 7 },
    { emoji: '🎵', title: 'התו הראשון', desc: 'השלם שיעור ראשון', unlocked: lessons.length > 0 },
    { emoji: '⭐', title: 'כוכב עולה', desc: 'הגע לרמה 5', unlocked: stats.level >= 5 },
    { emoji: '🏆', title: 'אלוף', desc: 'נצח בטבלת המובילים', unlocked: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: C.text,
            marginBottom: '4px',
            fontFamily: "'Heebo', sans-serif",
          }}
        >
          לוח הבקרה שלי 🎵
        </h1>
        <p style={{ color: C.textSub, fontSize: '14px', marginBottom: '22px' }}>
          המשך לתרגל כדי להתקדם לרמה הבאה!
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '22px',
          }}
        >
          {[
            {
              icon: '⭐',
              value: stats.xp.toLocaleString(),
              label: 'סה״כ XP',
              color: C.gold,
            },
            {
              icon: '🔥',
              value: `${stats.streak}י`,
              label: 'רצף',
              color: C.red,
            },
            {
              icon: '📚',
              value: lessons.length.toString(),
              label: 'שיעורים',
              color: C.blue,
            },
            {
              icon: '✏️',
              value: `${assignments.filter((a) => a.submitted).length}/${assignments.length}`,
              label: 'מטלות',
              color: C.primary,
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: C.textMuted,
                  fontWeight: 600,
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Level Card */}
      <Card>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LevelRing
            level={stats.level}
            xp={stats.xp}
            maxXp={stats.maxXp}
            size={82}
          />
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontWeight: 700,
                fontSize: '16px',
                color: C.text,
                marginBottom: '4px',
              }}
            >
              רמה {stats.level} — מוזיקאי מתמחה
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: C.textSub,
                marginBottom: '12px',
              }}
            >
              עוד {stats.maxXp - stats.xp} XP לרמה {stats.level + 1}
            </p>
            <XPBar
              xp={stats.xp}
              maxXp={stats.maxXp}
              level={stats.level}
            />
          </div>
          <Btn
            variant="primary"
            size="md"
            icon="▶"
            onClick={() => navigate?.('lesson')}
          >
            המשך שיעור
          </Btn>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '22px',
        }}
      >
        {/* Left Sidebar */}
        <div>
          {/* Assignments */}
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: C.text,
              marginBottom: '14px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            מטלות
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        flexShrink: 0,
                        background: assignment.submitted
                          ? C.greenLight
                          : C.primaryLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                      }}
                    >
                      {assignment.submitted ? '✅' : '📝'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {assignment.tasks?.title || 'מטלה'}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: assignment.submitted ? C.green : C.textMuted,
                          fontWeight: 600,
                          marginTop: '2px',
                        }}
                      >
                        {assignment.submitted ? 'הוגש' : 'ממתין'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: C.textMuted,
                  }}
                >
                  אין מטלות כרגע
                </div>
              </Card>
            )}
          </div>

          {/* Achievements */}
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: C.text,
              marginBottom: '14px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            הישגים
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {achievementData.map((achievement) => (
              <Card
                key={achievement.title}
                style={{
                  opacity: achievement.unlocked ? 1 : 0.6,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>
                  {achievement.emoji}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  {achievement.title}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: C.textMuted,
                    marginTop: '4px',
                  }}
                >
                  {achievement.desc}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: C.text,
              marginBottom: '14px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            השיעורים שלי
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => navigate?.('lesson')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      fontSize: '36px',
                      marginBottom: '12px',
                    }}
                  >
                    🎵
                  </div>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: '4px',
                      fontFamily: "'Heebo', sans-serif",
                    }}
                  >
                    {lesson.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      color: C.textSub,
                      marginBottom: '12px',
                    }}
                  >
                    {lesson.description}
                  </p>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: C.gold,
                    }}
                  >
                    +{lesson.xp_reward || 150} XP
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: C.textMuted,
                    gridColumn: '1 / -1',
                  }}
                >
                  אין שיעורים זמינים כרגע
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
