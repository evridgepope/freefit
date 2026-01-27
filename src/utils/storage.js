// LocalStorage utilities for user preferences and settings

const STORAGE_KEYS = {
  NUTRITION_TARGETS: 'nutritionTargets',
  LAST_BACKUP: 'lastBackup',
  UI_STATE: 'uiState',
  SELECTED_MACHINES: 'selectedMachines',
  APP_INITIALIZED: 'appInitialized',
  VOLUME_GRANULARITY: 'volumeGranularity'
}

// Nutrition Targets
export const getNutritionTargets = () => {
  const targets = localStorage.getItem(STORAGE_KEYS.NUTRITION_TARGETS)
  return targets ? JSON.parse(targets) : {
    caloriesTarget: 2500,
    proteinTarget: 180,
    carbsTarget: 250,
    fatsTarget: 80
  }
}

export const setNutritionTargets = (targets) => {
  localStorage.setItem(STORAGE_KEYS.NUTRITION_TARGETS, JSON.stringify(targets))
}

// Last Backup Timestamp
export const getLastBackup = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP)
}

export const setLastBackup = (timestamp) => {
  localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, timestamp)
}

// App Initialization Flag
export const isAppInitialized = () => {
  return localStorage.getItem(STORAGE_KEYS.APP_INITIALIZED) === 'true'
}

export const setAppInitialized = (value) => {
  localStorage.setItem(STORAGE_KEYS.APP_INITIALIZED, value.toString())
}

// Selected Machines (user's available equipment)
export const getSelectedMachines = () => {
  const machines = localStorage.getItem(STORAGE_KEYS.SELECTED_MACHINES)
  return machines ? JSON.parse(machines) : []
}

export const setSelectedMachines = (machineIds) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_MACHINES, JSON.stringify(machineIds))
}

// UI State
export const getUIState = () => {
  const state = localStorage.getItem(STORAGE_KEYS.UI_STATE)
  return state ? JSON.parse(state) : {
    lastActiveTab: 'exercises',
    lastNutritionSubTab: 'log'
  }
}

export const setUIState = (state) => {
  localStorage.setItem(STORAGE_KEYS.UI_STATE, JSON.stringify(state))
}

// Volume Granularity Setting ('individual' or 'broad')
export const getVolumeGranularity = () => {
  return localStorage.getItem(STORAGE_KEYS.VOLUME_GRANULARITY) || 'individual'
}

export const setVolumeGranularity = (granularity) => {
  localStorage.setItem(STORAGE_KEYS.VOLUME_GRANULARITY, granularity)
}
