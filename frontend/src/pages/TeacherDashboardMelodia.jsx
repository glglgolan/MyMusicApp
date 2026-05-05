import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { C, G, Btn, Card, StreakBadge, Input } from '../design/designSystem';

export function TeacherDashboardMelodia({ user }) {
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch students
        const { data: studentsData } = await supabase
          .from('users')
          .select('*, gamification_stats(*)')
          .eq('role', 'student')
          .limit(10);

        setStudents(studentsData || []);

        // Fetch submissions
        const { data: submissionsData } = await supabase
          .from('submissions')
          .select('*, tasks(title), users(email)')
          .limit(10);

        setSubmissions(submissionsData || []);

        // Fetch lessons created by this teacher
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('teacher_id', user.id)
          .limit(10);

        setLessons(lessonsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle || !user) return;

    try {
      const { error } = await supabase.from('lessons').insert([
        {
          title: lessonTitle,
          description: lessonDesc,
          teacher_id: user.id,
          xp_reward: 150,
        },
      ]);

      if (error) throw error;

      setLessonTitle('');
      setLessonDesc('');
      setShowLessonModal(false);

      // Refresh lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('teacher_id', user.id)
        .limit(10);

      setLessons(lessonsData || []);
    } catch (err) {
      console.error('Error creating lesson:', err);
    }
  };

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

  const stats = [
    {
      icon: '👩‍🎓',
      value: students.length,
      label: 'תלמידים פעילים',
      color: C.blue,
    },
    {
      icon: '📚',
      value: lessons.length,
      label: 'שיעורים שנוצרו',
      color: C.primary,
    },
    {
      icon: '⏳',
      value: submissions.filter((s) => !s.reviewed).length,
      label: 'ממתינים לבדיקה',
      color: C.gold,
    },
    {
      icon: '💬',
      value: '5',
      label: 'הודעות חדשות',
      color: C.green,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
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
            לוח בקרה למורה 👩‍🏫
          </h1>
          <p style={{ color: C.textSub, fontSize: '14px' }}>
            נהל שיעורים, מטלות ותלמידים
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Btn variant="secondary" size="md" icon="📋">
            מטלה חדשה
          </Btn>
          <Btn
            variant="primary"
            size="md"
            icon="+"
            onClick={() => setShowLessonModal(true)}
          >
            צור שיעור
          </Btn>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: '24px',
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
          {/* Submissions */}
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: C.text,
              marginBottom: '14px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            ממתינים לבדיקה
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '22px',
            }}
          >
            {submissions.length > 0 ? (
              submissions.slice(0, 5).map((submission) => (
                <Card key={submission.id}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: submission.reviewed
                          ? C.greenLight
                          : C.goldLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                        flexShrink: 0,
                      }}
                    >
                      {submission.reviewed ? '✅' : '⏳'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {submission.users?.email || 'תלמיד'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: C.textSub,
                          marginTop: '2px',
                        }}
                      >
                        {submission.tasks?.title || 'מטלה'}
                      </div>
                    </div>
                  </div>
                  {!submission.reviewed && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '12px',
                      }}
                    >
                      <Btn variant="secondary" size="sm" full>
                        משוב
                      </Btn>
                      <Btn variant="primary" size="sm" full>
                        ✓ אשר
                      </Btn>
                    </div>
                  )}
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
                  אין הגשות ממתינות
                </div>
              </Card>
            )}
          </div>

          {/* Quick Stats */}
          <Card>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: C.text,
                marginBottom: '14px',
              }}
            >
              טבלת מובילים 🏆
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {students.slice(0, 3).map((student) => (
                <div
                  key={student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: G.primary,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {student.email?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: C.text,
                      }}
                    >
                      {student.email?.split('@')[0]}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: C.gold,
                    }}
                  >
                    {student.gamification_stats?.[0]?.xp || 0} XP
                  </div>
                </div>
              ))}
            </div>
          </Card>
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
            התלמידים שלי
          </h2>
          <Card padding={0} style={{ overflow: 'hidden', marginBottom: '22px' }}>
            {students.length > 0 ? (
              students.map((student, index) => (
                <div
                  key={student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 20px',
                    borderBottom:
                      index < students.length - 1
                        ? `1px solid ${C.border}`
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: G.primary,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {student.email?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: C.text,
                      }}
                    >
                      {student.email?.split('@')[0]}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: C.textMuted,
                      }}
                    >
                      רמה {Math.floor((student.gamification_stats?.[0]?.xp || 0) / 500) + 1} ·{' '}
                      {student.gamification_stats?.[0]?.xp || 0} XP
                    </div>
                  </div>
                  {student.gamification_stats?.[0]?.streak > 0 && (
                    <StreakBadge streak={student.gamification_stats[0].streak} />
                  )}
                  <Btn variant="secondary" size="sm">
                    💬
                  </Btn>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: C.textMuted,
                }}
              >
                אין תלמידים עדיין
              </div>
            )}
          </Card>

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
                <Card key={lesson.id}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>
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
                      lineHeight: '1.4',
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
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    <Btn variant="secondary" size="sm" full>
                      ערוך
                    </Btn>
                    <Btn variant="secondary" size="sm" full>
                      מחק
                    </Btn>
                  </div>
                </Card>
              ))
            ) : (
              <Card style={{ gridColumn: '1 / -1' }}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: C.textMuted,
                  }}
                >
                  לא יצרת עדיין שיעורים. לחץ על "צור שיעור" לעלות לשיעור חדש!
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Lesson Modal */}
      {showLessonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowLessonModal(false)}
        >
          <Card
            style={{
              width: '460px',
              maxWidth: '90vw',
              padding: '32px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: C.text,
                  fontFamily: "'Heebo', sans-serif",
                }}
              >
                צור שיעור חדש 🎵
              </h2>
              <button
                onClick={() => setShowLessonModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '22px',
                  color: C.textMuted,
                }}
              >
                ×
              </button>
            </div>
            <p
              style={{
                color: C.textSub,
                fontSize: '13px',
                marginBottom: '22px',
              }}
            >
              הוסף שיעור חדש לתלמידים שלך
            </p>

            <form
              onSubmit={handleCreateLesson}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: C.text,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  שם השיעור
                </label>
                <Input
                  placeholder="לדוגמה: סולם דו מז׳ור"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: C.text,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  תיאור
                </label>
                <textarea
                  placeholder="תיאור השיעור..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    direction: 'rtl',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '12px',
                }}
              >
                <Btn
                  variant="secondary"
                  size="md"
                  full
                  onClick={() => setShowLessonModal(false)}
                >
                  ביטול
                </Btn>
                <Btn variant="primary" size="md" full onClick={handleCreateLesson}>
                  צור שיעור
                </Btn>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
