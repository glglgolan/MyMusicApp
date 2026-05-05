import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { C, G, Btn, Card, MusicStaff } from '../design/designSystem';

export function LessonPlayerMelodia({ navigate, lessonId = 1 }) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [activeNote, setActiveNote] = useState(-1);
  const [mode, setMode] = useState('normal');
  const [focusMode, setFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const TOTAL_NOTES = 8;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        setLesson(data || { title: 'סולם דו מז׳ור', description: 'שיעור על סולם דו מז׳ור', xp_reward: 150 });
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setLesson({
          title: 'סולם דו מז׳ור',
          description: 'שיעור על סולם דו מז׳ור',
          xp_reward: 150,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    if (playing) {
      const ms = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        setActiveNote((prev) => {
          const next = prev + 1;
          if (next >= TOTAL_NOTES) {
            setPlaying(false);
            return TOTAL_NOTES - 1;
          }
          return next;
        });
        setProgress((p) => Math.min(100, p + 100 / TOTAL_NOTES));
        setElapsed((e) => e + ms / 1000);
      }, ms);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, bpm]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setActiveNote(-1);
      setElapsed(0);
    }
    setPlaying((p) => !p);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const dark = focusMode;
  const surface = dark ? '#1E293B' : C.surface;
  const textCol = dark ? '#F1F5F9' : C.text;
  const mutedCol = dark ? 'rgba(241,245,249,0.45)' : C.textMuted;
  const borderCol = dark ? 'rgba(255,255,255,0.08)' : C.border;

  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        ...(dark
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: '#0F172A',
              padding: '32px',
              overflowY: 'auto',
            }
          : {}),
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <button
            onClick={() => {
              setFocusMode(false);
              navigate?.('student');
            }}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: mutedCol,
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '6px',
              fontFamily: 'inherit',
              padding: 0,
            }}
          >
            → חזרה ללוח הבקרה
          </button>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: textCol,
              marginBottom: '3px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            {lesson?.title || 'שיעור'}
          </h1>
          <p style={{ fontSize: '13px', color: mutedCol }}>
            רמה 1 · גיטרה ·{' '}
            <span style={{ color: C.gold, fontWeight: 700 }}>
              +{lesson?.xp_reward || 150} XP
            </span>{' '}
            בסיום
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              background: dark ? 'rgba(255,255,255,0.08)' : C.bg,
              borderRadius: '12px',
              padding: '4px',
              gap: '3px',
            }}
          >
            {[
              { id: 'normal', label: 'רגיל' },
              { id: 'wait', label: '⏳ מצב המתנה' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: '7px 15px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  background:
                    mode === m.id
                      ? dark
                        ? 'rgba(255,255,255,0.18)'
                        : C.surface
                      : 'transparent',
                  color:
                    mode === m.id
                      ? dark
                        ? 'white'
                        : C.primary
                      : mutedCol,
                  transition: 'all 0.18s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFocusMode((f) => !f)}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              border: `1.5px solid ${borderCol}`,
              background: dark ? 'rgba(255,255,255,0.08)' : C.surface,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              color: textCol,
              fontFamily: 'inherit',
            }}
          >
            {dark ? '☀️ צא ממצב מיקוד' : '🔍 מצב מיקוד'}
          </button>
        </div>
      </div>

      {/* Music notation card */}
      <Card
        style={{
          background: surface,
          borderRadius: '24px',
          padding: '28px 36px',
          border: `1px solid ${borderCol}`,
          boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: C.primary,
                background: C.primaryLight,
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              סולם דו מז׳ור
            </span>
            <span
              style={{
                fontSize: '11px',
                color: mutedCol,
                fontWeight: 600,
              }}
            >
              מפתח סול · 4/4
            </span>
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: activeNote >= 0 ? C.primary : mutedCol,
              direction: 'ltr',
            }}
          >
            {activeNote >= 0
              ? `♩ ${['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'][activeNote]}`
              : '♩ מוכן לנגינה'}
          </div>
        </div>

        <MusicStaff activeNote={activeNote} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '10px',
            paddingLeft: '64px',
            paddingRight: '10px',
          }}
        >
          {noteNames.map((n, i) => (
            <div
              key={i}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background:
                  activeNote === i
                    ? C.primary
                    : dark
                      ? 'rgba(255,255,255,0.08)'
                      : C.bg,
                color: activeNote === i ? 'white' : mutedCol,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.18s',
                transform: activeNote === i ? 'scale(1.25)' : 'scale(1)',
                boxShadow:
                  activeNote === i
                    ? '0 0 0 3px rgba(124,58,237,0.2)'
                    : 'none',
                direction: 'ltr',
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </Card>

      {/* Transport controls */}
      <Card
        style={{
          background: surface,
          borderRadius: '24px',
          padding: '20px 30px',
          border: `1px solid ${borderCol}`,
          boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              height: '5px',
              background: dark ? 'rgba(255,255,255,0.1)' : C.bg,
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: G.ocean,
                borderRadius: '999px',
                transition: 'width 0.25s linear',
                boxShadow: '0 0 8px rgba(124,58,237,0.4)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: mutedCol,
              fontWeight: 600,
              direction: 'ltr',
            }}
          >
            <span>{fmt(elapsed)}</span>
            <span>
              0:{String(Math.round((60 / bpm) * TOTAL_NOTES)).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={togglePlay}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: G.primary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white',
              boxShadow: '0 6px 20px rgba(124,58,237,0.45)',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flex: 1,
              minWidth: '200px',
              direction: 'ltr',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: mutedCol,
                whiteSpace: 'nowrap',
              }}
            >
              ♩ = BPM
            </span>
            <button
              onClick={() => setBpm((b) => Math.max(40, b - 10))}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: `1.5px solid ${borderCol}`,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                color: textCol,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              −
            </button>
            <div
              style={{
                minWidth: '52px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: textCol,
                fontFamily: "'Space Grotesk', sans-serif",
                flexShrink: 0,
              }}
            >
              {bpm}
            </div>
            <button
              onClick={() => setBpm((b) => Math.min(240, b + 10))}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                border: `1.5px solid ${borderCol}`,
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                color: textCol,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              +
            </button>
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              style={{
                flex: 1,
                accentColor: C.primary,
                height: '4px',
              }}
            />
          </div>

          {!submitted ? (
            <Btn
              variant="gold"
              size="md"
              icon="🎙"
              onClick={() => setShowSubmit(true)}
            >
              הגש ביצוע
            </Btn>
          ) : (
            <div
              style={{
                padding: '10px 18px',
                background: C.greenLight,
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                color: C.green,
              }}
            >
              ✓ הוגש!
            </div>
          )}
        </div>
      </Card>

      {mode === 'wait' && (
        <div
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
            border: `1.5px solid ${C.gold}`,
            fontSize: '13px',
            fontWeight: 600,
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '18px' }}>⏳</span>
          <span>
            מצב המתנה פעיל — המוזיקה תעצור עד שתנגן את התו המסומן נכון
          </span>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowSubmit(false)}
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
                הגש ביצוע 🎙
              </h2>
              <button
                onClick={() => setShowSubmit(false)}
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
              הקלט או העלה את הביצוע שלך לבדיקת המורה וקבל XP
            </p>

            <div
              style={{
                background: C.bg,
                borderRadius: '18px',
                padding: '28px',
                textAlign: 'center',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '52px', marginBottom: '10px' }}>
                🎙
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: '6px',
                }}
              >
                לחץ כדי להתחיל הקלטה
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: C.textMuted,
                  marginBottom: '18px',
                }}
              >
                או גרור קובץ אודיו/וידאו לכאן
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                }}
              >
                <Btn variant="fire" size="md" icon="⏺">
                  התחל הקלטה
                </Btn>
                <Btn variant="secondary" size="md" icon="📁">
                  העלה קובץ
                </Btn>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: C.text,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                הוסף הערה (אופציונלי)
              </label>
              <textarea
                placeholder="תאר מה תרגלת, קשיים שנתקלת בהם וכו׳..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  direction: 'rtl',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              <Btn
                variant="secondary"
                size="md"
                full
                onClick={() => setShowSubmit(false)}
              >
                ביטול
              </Btn>
              <Btn
                variant="primary"
                size="md"
                full
                icon="🚀"
                onClick={() => {
                  setShowSubmit(false);
                  setSubmitted(true);
                }}
              >
                הגש (+{lesson?.xp_reward || 150} XP)
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
