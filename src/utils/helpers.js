// Helper functions

// Generate unique IDs
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Format date to MM/DD/YYYY
export const formatDateDisplay = (date) => {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

// Format time to HH:MM AM/PM
export const formatTime = (date) => {
  const d = new Date(date)
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

// Get today's date string
export const getTodayDate = () => {
  return formatDate(new Date())
}

// Check if a date is today
export const isToday = (dateString) => {
  return dateString === getTodayDate()
}

// Calculate total macros from food entries
export const calculateTotals = (entries) => {
  return entries.reduce((totals, entry) => {
    return {
      calories: totals.calories + (entry.totalCalories || 0),
      protein: totals.protein + (entry.totalProtein || 0),
      carbs: totals.carbs + (entry.totalCarbs || 0),
      fats: totals.fats + (entry.totalFats || 0)
    }
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 })
}

// Calculate progress percentage
export const calculateProgress = (current, target) => {
  if (target === 0) return 0
  return Math.round((current / target) * 100)
}

// Get progress bar color class
export const getProgressColor = (percentage) => {
  if (percentage < 80) return 'low'
  if (percentage < 95) return 'medium'
  if (percentage <= 105) return 'good'
  return 'high'
}

// Calculate volume for routines (sets per muscle group)
export const calculateVolume = (routine, exercises) => {
  const volumeMap = {}

  routine.days?.forEach(day => {
    day.exercises?.forEach(routineExercise => {
      const exercise = exercises.find(e => e.id === routineExercise.exerciseId)
      if (exercise && exercise.type === 'dynamic') {
        // Only count primary muscles
        exercise.primaryMuscles?.forEach(muscle => {
          const numSets = routineExercise.sets?.length || 0
          volumeMap[muscle] = (volumeMap[muscle] || 0) + numSets
        })
      }
    })
  })

  return volumeMap
}

// Sort volume map by volume (descending)
export const sortVolumeMap = (volumeMap) => {
  return Object.entries(volumeMap)
    .sort(([, a], [, b]) => b - a)
}

// Format muscle name for display
export const formatMuscleName = (muscleId) => {
  return muscleId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Muscle group mappings
export const MUSCLE_GROUPS = {
  chest: [
    'pectoralis_major_upper',
    'pectoralis_major_lower',
    'pectoralis_minor'
  ],
  back: [
    'latissimus_dorsi',
    'trapezius_upper',
    'trapezius_middle',
    'trapezius_lower',
    'rhomboids',
    'erector_spinae'
  ],
  shoulders: [
    'anterior_deltoid',
    'lateral_deltoid',
    'posterior_deltoid'
  ],
  arms: [
    'biceps_brachii',
    'triceps_brachii',
    'forearm_flexors',
    'forearm_extensors'
  ],
  legs: [
    'quadriceps',
    'hamstrings',
    'gluteus_maximus',
    'gluteus_medius',
    'gastrocnemius',
    'soleus',
    'hip_adductors',
    'hip_abductors',
    'tibialis_anterior'
  ],
  core: [
    'rectus_abdominis',
    'obliques_external',
    'obliques_internal',
    'transverse_abdominis'
  ]
}

// Get broad muscle group for a specific muscle
export const getBroadMuscleGroup = (muscleId) => {
  for (const [group, muscles] of Object.entries(MUSCLE_GROUPS)) {
    if (muscles.includes(muscleId)) {
      return group
    }
  }
  return null
}

// Group volume by broad muscle groups
export const groupVolumeByBroadGroups = (volumeMap) => {
  const grouped = {}

  for (const [muscleId, volume] of Object.entries(volumeMap)) {
    const group = getBroadMuscleGroup(muscleId)
    if (group) {
      grouped[group] = (grouped[group] || 0) + volume
    }
  }

  return grouped
}

// Convert broad group volume back to individual muscles for display
export const expandBroadGroupVolume = (broadGroupVolume) => {
  const expanded = {}

  for (const [group, volume] of Object.entries(broadGroupVolume)) {
    const muscles = MUSCLE_GROUPS[group] || []
    muscles.forEach(muscle => {
      expanded[muscle] = volume
    })
  }

  return expanded
}
