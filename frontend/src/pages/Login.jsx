import { useState } from 'react'

export default function Login({ supabase }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (authError) throw authError

        // Insert user into database with role
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          role,
          created_at: new Date(),
        })

        if (dbError) throw dbError

        setError('Account created! Please check your email to verify.')
        setEmail('')
        setPassword('')
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>
        🎵 Music Learning
      </h1>

      {error && <div className={error.includes('created') ? 'success' : 'error'}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {isSignUp && (
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isSignUp ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
