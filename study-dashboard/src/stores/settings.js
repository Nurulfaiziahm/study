import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const targetStudyHoursPerDay = useLocalStorage('study-dashboard-target-hours', 4)
  const dailySessionGoal = useLocalStorage('study-dashboard-session-goal', 8) // sessions per day
  const studyHistory = useLocalStorage('study-dashboard-history', [])

  const completedSessionsToday = computed(() => {
    const today = new Date().toDateString()
    return studyHistory.value.filter(s => new Date(s.date).toDateString() === today).length
  })

  const remainingSessionsToday = computed(() => {
    return Math.max(0, dailySessionGoal.value - completedSessionsToday.value)
  })

  const targetProgressPercentage = computed(() => {
    if (dailySessionGoal.value === 0) return 0
    return Math.round((completedSessionsToday.value / dailySessionGoal.value) * 100)
  })

  const targetGap = computed(() => {
    return Math.max(0, dailySessionGoal.value - completedSessionsToday.value)
  })

  const studyHoursThisWeek = computed(() => {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const minutes = studyHistory.value
      .filter(s => new Date(s.date) >= lastWeek)
      .reduce((acc, s) => acc + s.durationMinutes, 0)
    return (minutes / 60).toFixed(1)
  })

  const studyHoursThisMonth = computed(() => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const minutes = studyHistory.value
      .filter(s => new Date(s.date) >= startOfMonth)
      .reduce((acc, s) => acc + s.durationMinutes, 0)
    return (minutes / 60).toFixed(1)
  })

  const weeklyStudyHours = computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const minutes = studyHistory.value
        .filter(s => new Date(s.date).toDateString() === dateStr)
        .reduce((acc, s) => acc + s.durationMinutes, 0)
      days.push(minutes / 60)
    }
    return days
  })

  const monthlyStudyHours = computed(() => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const minutes = studyHistory.value
        .filter(s => new Date(s.date).toDateString() === dateStr)
        .reduce((acc, s) => acc + s.durationMinutes, 0)
      days.push(minutes / 60)
    }
    return days
  })

  const logStudySession = (moduleId, durationMinutes) => {
    studyHistory.value.push({
      id: uuidv4(),
      moduleId,
      durationMinutes,
      date: new Date().toISOString()
    })
  }

  const setTargetHours = (hours) => {
    targetStudyHoursPerDay.value = hours
  }

  const setSessionGoal = (goal) => {
    dailySessionGoal.value = goal
  }

  return {
    targetStudyHoursPerDay,
    dailySessionGoal,
    studyHistory,
    completedSessionsToday,
    remainingSessionsToday,
    targetProgressPercentage,
    targetGap,
    studyHoursThisWeek,
    studyHoursThisMonth,
    weeklyStudyHours,
    monthlyStudyHours,
    logStudySession,
    setTargetHours,
    setSessionGoal
  }
})
