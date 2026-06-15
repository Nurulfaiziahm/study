import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const courses = useLocalStorage('study-dashboard-courses', [])

  const allModules = computed(() => {
    return courses.value.flatMap(c => c.modules)
  })

  const totalModules = computed(() => allModules.value.length)
  
  const completedModules = computed(() => {
    return allModules.value.filter(m => m.status === 'mastered').length
  })

  const remainingModules = computed(() => {
    return allModules.value.filter(m => m.status !== 'mastered').length
  })

  const masteryPercentage = computed(() => {
    if (totalModules.value === 0) return 0
    return Math.round((completedModules.value / totalModules.value) * 100)
  })

  const daysUntilExams = computed(() => {
    const today = new Date()
    const differences = courses.value
      .map(c => new Date(c.examDate))
      .map(date => Math.ceil((new Date(date) - today) / (1000 * 60 * 60 * 24)))
      .filter(diff => diff >= 0)
    
    return differences.length > 0 ? Math.min(...differences) : 0
  })

  const dailyModuleGoal = computed(() => {
    if (daysUntilExams.value <= 0) return remainingModules.value
    return Math.ceil(remainingModules.value / daysUntilExams.value)
  })

  const averageMastery = computed(() => {
    if (totalModules.value === 0) return 0
    const weights = {
      mastered: 1,
      proficient: 0.75,
      needsReview: 0.25,
      notStarted: 0
    }
    const score = allModules.value.reduce((acc, m) => acc + (weights[m.status] || 0), 0)
    return Math.round((score / totalModules.value) * 100)
  })

  const masteryDistribution = computed(() => {
    const counts = {
      notStarted: 0,
      needsReview: 0,
      proficient: 0,
      mastered: 0
    }
    allModules.value.forEach(m => {
      if (counts[m.status] !== undefined) {
        counts[m.status]++
      }
    })
    return counts
  })

  const addCourse = (name, examDate) => {
    courses.value.push({
      id: uuidv4(),
      name,
      examDate,
      modules: []
    })
  }

  const updateCourse = (courseId, name, examDate) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      course.name = name
      course.examDate = examDate
      courses.value = [...courses.value]
    }
  }

  const deleteCourse = (courseId) => {
    courses.value = courses.value.filter(c => c.id !== courseId)
  }

  const addModule = (courseId, title) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      course.modules.push({
        id: uuidv4(),
        title,
        status: 'notStarted', // 'notStarted', 'needsReview', 'proficient', 'mastered'
        scheduledDate: null,
        notes: []
      })
      courses.value = [...courses.value]
    }
  }

  const deleteModule = (courseId, moduleId) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      course.modules = course.modules.filter(m => m.id !== moduleId)
      courses.value = [...courses.value]
    }
  }

  const updateModuleStatus = (courseId, moduleId, status) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      const module = course.modules.find(m => m.id === moduleId)
      if (module) {
        module.status = status
        courses.value = [...courses.value]
      }
    }
  }

  const updateModuleTitle = (courseId, moduleId, title) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      const module = course.modules.find(m => m.id === moduleId)
      if (module) {
        module.title = title
        courses.value = [...courses.value]
      }
    }
  }

  const updateModuleScheduledDate = (courseId, moduleId, date) => {
    const courseIndex = courses.value.findIndex(c => c.id === courseId)
    if (courseIndex !== -1) {
      const moduleIndex = courses.value[courseIndex].modules.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1) {
        courses.value[courseIndex].modules[moduleIndex].scheduledDate = date
        // Trigger reactivity for useLocalStorage
        courses.value = [...courses.value]
      }
    }
  }

  const addNote = (courseId, moduleId, content) => {
    const courseIndex = courses.value.findIndex(c => c.id === courseId)
    if (courseIndex !== -1) {
      const moduleIndex = courses.value[courseIndex].modules.findIndex(m => m.id === moduleId)
      if (moduleIndex !== -1) {
        courses.value[courseIndex].modules[moduleIndex].notes.push({
          id: uuidv4(),
          content,
          createdAt: new Date().toISOString()
        })
        courses.value = [...courses.value]
      }
    }
  }

  const autoScheduleModules = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const newCourses = JSON.parse(JSON.stringify(courses.value))

    newCourses.forEach(course => {
      if (!course.examDate) return
      
      const examDate = new Date(course.examDate)
      examDate.setHours(0, 0, 0, 0)
      
      const incompleteModules = course.modules.filter(m => m.status !== 'mastered')
      if (incompleteModules.length === 0) return

      const diffTime = examDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 0) {
        // Exam is today or past, schedule all remaining for today
        incompleteModules.forEach(m => {
          m.scheduledDate = getLocalDateString(today)
        })
      } else {
        // Distribute modules evenly
        incompleteModules.forEach((m, index) => {
          const dayOffset = Math.floor(index * (diffDays / incompleteModules.length))
          const scheduledDate = new Date(today)
          scheduledDate.setDate(today.getDate() + dayOffset)
          m.scheduledDate = getLocalDateString(scheduledDate)
        })
      }
    })

    courses.value = newCourses
  }

  return {
    courses,
    totalModules,
    completedModules,
    remainingModules,
    masteryPercentage,
    daysUntilExams,
    dailyModuleGoal,
    averageMastery,
    masteryDistribution,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    deleteModule,
    updateModuleStatus,
    updateModuleTitle,
    updateModuleScheduledDate,
    addNote,
    autoScheduleModules
  }
})

