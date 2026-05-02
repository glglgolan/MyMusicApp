import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Login from './pages/Login'
import Home from './pages/Home'
import TeacherDashboard from './pages/TeacherDashboardEnhanced'
import StudentDashboard from './pages/StudentDashboardGamified'
import Navbar from './components/Navbar'
import { initializeRTLSupport, getLanguagePreference } from './utils/rtl'
import './rtl.css'
import './styles/gamification.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // Initialize RTL support
    initializeRTLSupport()

    const checkUser = async () => {
      try {
        // Race getSession against a 3s timeout to avoid hanging on stale sessions
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('session_timeout')), 3000)
        )
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])

        if (session) {
          setUser(session.user)
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()
          if (data) {
            setRole(data.role)
            // Auto-route to dashboard based on role
            const savedPage = localStorage.getItem('currentPage')
            if (data.role === 'teacher') {
              setCurrentPage(savedPage || 'teacher')
            } else if (data.role === 'student') {
              setCurrentPage(savedPage || 'student')
            }
          }
        }
      } catch (err) {
        if (err.message === 'session_timeout') {
          // Stale session data — clear it and show login
          console.warn('Session timed out, clearing auth state')
          await supabase.auth.signOut()
        } else {
          console.error('Auth check failed:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (data) {
          setRole(data.role)
          // Auto-route to dashboard based on role
          if (data.role === 'teacher') {
            setCurrentPage('teacher')
          } else if (data.role === 'student') {
            setCurrentPage('student')
          }
        }
      } else {
        setUser(null)
        setRole(null)
        setCurrentPage('home')
        localStorage.removeItem('currentPage')
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setCurrentPage('home')
    localStorage.removeItem('currentPage')
  }

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentPage', currentPage)
    }
  }, [currentPage, user])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Login supabase={supabase} />
  }

  return (
    <div className="app">
      <Navbar user={user} role={role} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        {currentPage === 'home' && <Home supabase={supabase} user={user} role={role} />}
        {currentPage === 'teacher' && role === 'teacher' && <TeacherDashboard supabase={supabase} user={user} />}
        {currentPage === 'student' && role === 'student' && <StudentDashboard supabase={supabase} user={user} />}
      </main>
    </div>
  )
}

export default App
