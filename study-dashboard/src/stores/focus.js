import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useFocusStore = defineStore('focus', () => {
  const modes = [
    { id: 'deep_work', name: 'Deep Work', durationMinutes: 50 },
    { id: 'pomodoro', name: 'Pomodoro', durationMinutes: 25 },
    { id: 'quick_review', name: 'Quick Review', durationMinutes: 15 }
  ]

  const selectedModeId = useLocalStorage('study-dashboard-selected-mode', 'pomodoro')
  const selectedMode = ref(modes.find(m => m.id === selectedModeId.value) || modes[1])
  
  const isRunning = useLocalStorage('study-dashboard-timer-running', false)
  const isPaused = useLocalStorage('study-dashboard-timer-paused', false)
  const remainingSeconds = useLocalStorage('study-dashboard-timer-seconds', selectedMode.value.durationMinutes * 60)
  const activeModuleId = useLocalStorage('study-dashboard-active-module', null)
  const startTime = useLocalStorage('study-dashboard-timer-start-time', null)

  const selectMode = (modeId) => {
    const mode = modes.find(m => m.id === modeId)
    if (mode) {
      selectedMode.value = mode
      selectedModeId.value = modeId
      resetTimer()
    }
  }

  const startTimer = (moduleId = null) => {
    activeModuleId.value = moduleId
    isRunning.value = true
    isPaused.value = false
    startTime.value = new Date().toISOString()
  }

  const pauseTimer = () => {
    isPaused.value = true
  }

  const resumeTimer = () => {
    isPaused.value = false
  }

  const resetTimer = () => {
    isRunning.value = false
    isPaused.value = false
    remainingSeconds.value = selectedMode.value.durationMinutes * 60
    activeModuleId.value = null
    startTime.value = null
  }

  const tick = () => {
    if (isRunning.value && !isPaused.value && remainingSeconds.value > 0) {
      remainingSeconds.value--
    }
  }

  // Handle timer continuity if page is refreshed while running
  const syncTimer = () => {
    if (isRunning.value && !isPaused.value && startTime.value) {
      const now = new Date()
      const start = new Date(startTime.value)
      const elapsedSeconds = Math.floor((now - start) / 1000)
      const totalDurationSeconds = selectedMode.value.durationMinutes * 60
      
      const newRemaining = totalDurationSeconds - elapsedSeconds
      if (newRemaining <= 0) {
        remainingSeconds.value = 0
      } else {
        remainingSeconds.value = newRemaining
      }
    }
  }

  // Run sync on initialization
  syncTimer()

  return {
    modes,
    selectedMode,
    isRunning,
    isPaused,
    remainingSeconds,
    activeModuleId,
    selectMode,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick
  }
})
