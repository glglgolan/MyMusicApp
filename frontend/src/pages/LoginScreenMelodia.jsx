import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { C, G, Btn, Card, Input } from '../design/designSystem';

export function LoginScreenMelodia({ onLogin }) {
  const [step, setStep] = useState('role');
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep('auth');
    setError('');
  };

  const handleGoBack = () => {
    setStep('role');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data?.user) {
        onLogin?.(role || 'student');
      }
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (signupError) throw signupError;

      if (data?.user) {
        setError('חשבון נוצר בהצלחה! אנא התחבר/י');
        setIsSignup(false);
      }
    } catch (err) {
      setError(err.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'role') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: G.primary,
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '48px',
              color: 'white',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: '16px',
              }}
            >
              🎵
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                marginBottom: '12px',
                fontFamily: "'Heebo', sans-serif",
              }}
            >
              מלודיה
            </h1>
            <p
              style={{
                fontSize: '16px',
                opacity: 0.9,
                fontFamily: "'Heebo', sans-serif",
              }}
            >
              אפליקציית למידה מוזיקלית אינטראקטיבית
            </p>
          </div>

          <Card style={{ padding: '32px' }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: C.text,
                marginBottom: '8px',
                textAlign: 'center',
                fontFamily: "'Heebo', sans-serif",
              }}
            >
              בחר/י תפקיד
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: C.textSub,
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              בחר אם אתה/ת תלמיד/ה או מורה
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div
                onClick={() => handleRoleSelect('student')}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: `2px solid ${C.border}`,
                  background: C.surface,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.background = C.primaryLight;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.surface;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: C.text,
                    fontFamily: "'Heebo', sans-serif",
                  }}
                >
                  תלמיד/ה
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: C.textSub,
                    marginTop: '8px',
                  }}
                >
                  למידה ותרגול
                </div>
              </div>

              <div
                onClick={() => handleRoleSelect('teacher')}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: `2px solid ${C.border}`,
                  background: C.surface,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.background = C.primaryLight;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.surface;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👩‍🏫</div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: C.text,
                    fontFamily: "'Heebo', sans-serif",
                  }}
                >
                  מורה
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: C.textSub,
                    marginTop: '8px',
                  }}
                >
                  הוראה וניהול
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: G.primary,
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎵</div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            מלודיה
          </h1>
        </div>

        <Card style={{ padding: '32px' }}>
          <button
            onClick={handleGoBack}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: C.textSub,
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '20px',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            ← חזור בחזרה
          </button>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: C.text,
              marginBottom: '8px',
              fontFamily: "'Heebo', sans-serif",
            }}
          >
            {isSignup ? 'הרשמה' : 'התחברות'}
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: C.textSub,
              marginBottom: '24px',
            }}
          >
            {role === 'student' ? '🎓 חשבון תלמיד/ה' : '👩‍🏫 חשבון מורה'}
          </p>

          {error && (
            <div
              style={{
                padding: '12px',
                background: C.redLight,
                border: `1px solid ${C.red}`,
                borderRadius: '8px',
                color: C.red,
                fontSize: '12px',
                marginBottom: '16px',
                fontWeight: 600,
                direction: 'rtl',
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
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
                דוא״ל
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                rtl={false}
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
                סיסמה
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rtl={false}
              />
            </div>

            <Btn
              variant="primary"
              size="md"
              full
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? '⏳...' : isSignup ? 'הרשמה' : 'התחברות'}
            </Btn>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '13px',
              color: C.textSub,
            }}
          >
            {isSignup ? (
              <>
                כבר יש לך חשבון?{' '}
                <button
                  onClick={() => setIsSignup(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: C.primary,
                    cursor: 'pointer',
                    fontWeight: 700,
                    padding: 0,
                  }}
                >
                  התחבר/י כאן
                </button>
              </>
            ) : (
              <>
                אין לך חשבון?{' '}
                <button
                  onClick={() => setIsSignup(true)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: C.primary,
                    cursor: 'pointer',
                    fontWeight: 700,
                    padding: 0,
                  }}
                >
                  הירשם/י כאן
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
