import { useState, useEffect, useCallback } from 'react'

export function useGamification(userId) {
  const [stats, setStats] = useState({
    points: 0,
    streak: 0,
    achievements: [],
    level: 1,
    totalLessonsCompleted: 0,
    assignmentsSubmitted: 0,
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [showCelebration, setShowCelebration] = useState(false)

  // Initialize gamification stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`gamification-${userId}`)
    if (saved) {
      setStats(JSON.parse(saved))
    }
  }, [userId])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem(`gamification-${userId}`, JSON.stringify(stats))
  }, [stats, userId])

  // Add points
  const addPoints = useCallback((points, reason = 'activity') => {
    setStats((prev) => {
      const newPoints = prev.points + points
      const newLevel = Math.floor(newPoints / 100) + 1

      setRecentActivity((act) => [
        { type: 'points', amount: points, reason, timestamp: new Date() },
        ...act.slice(0, 4),
      ])

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      }
    })
    triggerCelebration()
  }, [])

  // Update streak
  const updateStreak = useCallback((increment = 1) => {
    setStats((prev) => ({
      ...prev,
      streak: prev.streak + increment,
    }))
  }, [])

  // Complete lesson
  const completeLesson = useCallback(() => {
    addPoints(10, 'lesson_completed')
    setStats((prev) => ({
      ...prev,
      totalLessonsCompleted: prev.totalLessonsCompleted + 1,
    }))
    updateStreak()
  }, [addPoints, updateStreak])

  // Submit assignment
  const submitAssignment = useCallback(() => {
    addPoints(15, 'assignment_submitted')
    setStats((prev) => ({
      ...prev,
      assignmentsSubmitted: prev.assignmentsSubmitted + 1,
    }))
  }, [addPoints])

  // Unlock achievement
  const unlockAchievement = useCallback((achievement) => {
    setStats((prev) => {
      const exists = prev.achievements.some((a) => a.id === achievement.id)
      if (exists) return prev

      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
        points: prev.points + (achievement.points || 0),
      }
    })
    triggerCelebration()
  }, [])

  // Trigger celebration animation
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }, [])

  // Get level details
  const getLevelInfo = useCallback(() => {
    const levelPoints = (stats.level - 1) * 100
    const nextLevelPoints = stats.level * 100
    const currentLevelPoints = stats.points - levelPoints
    const totalLevelPoints = nextLevelPoints - levelPoints

    return {
      current: stats.level,
      currentPoints: currentLevelPoints,
      totalPoints: totalLevelPoints,
      progress: (currentLevelPoints / totalLevelPoints) * 100,
    }
  }, [stats.points, stats.level])

  // Check achievements
  const checkAchievements = useCallback(() => {
    const achievements = [
      {
        id: 'first_lesson',
        title: 'First Step',
        description: 'Complete your first lesson',
        icon: '🎵',
        condition: () => stats.totalLessonsCompleted >= 1,
        points: 25,
      },
      {
        id: 'lesson_master',
        title: 'Lesson Master',
        description: 'Complete 5 lessons',
        icon: '🎸',
        condition: () => stats.totalLessonsCompleted >= 5,
        points: 50,
      },
      {
        id: 'streak_warrior',
        title: 'Streak Warrior',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        condition: () => stats.streak >= 3,
        points: 75,
      },
      {
        id: 'assignment_pro',
        title: 'Assignment Pro',
        description: 'Submit 5 assignments',
        icon: '📝',
        condition: () => stats.assignmentsSubmitted >= 5,
        points: 100,
      },
      {
        id: 'level_5',
        title: 'Level 5 Reached',
        description: 'Reach level 5',
        icon: '⭐',
        condition: () => stats.level >= 5,
        points: 150,
      },
    ]

    achievements.forEach((achievement) => {
      if (
        achievement.condition() &&
        !stats.achievements.some((a) => a.id === achievement.id)
      ) {
        unlockAchievement(achievement)
      }
    })
  }, [stats, unlockAchievement])

  // Auto-check achievements when stats change
  useEffect(() => {
    checkAchievements()
  }, [stats.totalLessonsCompleted, stats.assignmentsSubmitted, stats.streak, stats.level, checkAchievements])

  return {
    stats,
    addPoints,
    updateStreak,
    completeLesson,
    submitAssignment,
    unlockAchievement,
    triggerCelebration,
    showCelebration,
    getLevelInfo,
    recentActivity,
  }
}

export default useGamification
