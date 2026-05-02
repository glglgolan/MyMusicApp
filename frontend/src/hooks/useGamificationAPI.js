import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function useGamificationAPI(userId) {
  const [profile, setProfile] = useState({ xp: 0, level: 1, streak: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/gamification/profile/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error('Error fetching gamification profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const addXP = async (amount) => {
    try {
      const res = await fetch(`${API_URL}/gamification/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, amount }),
      })
      if (!res.ok) throw new Error('Failed to add XP')
      const data = await res.json()
      setProfile((prev) => ({
        ...prev,
        xp: data.xp,
        level: data.level,
      }))
      return data
    } catch (err) {
      console.error('Error adding XP:', err)
    }
  }

  const recordActivity = async () => {
    try {
      const res = await fetch(`${API_URL}/gamification/activity/${userId}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to record activity')
      const data = await res.json()
      setProfile((prev) => ({
        ...prev,
        streak: data.streak,
      }))
      return data
    } catch (err) {
      console.error('Error recording activity:', err)
    }
  }

  return { profile, loading, addXP, recordActivity, refetch: fetchProfile }
}
