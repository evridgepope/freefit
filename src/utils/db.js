import { openDB } from 'idb'

const DB_NAME = 'FreeFitDB'
const DB_VERSION = 1

// Initialize IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Food Entries store
      if (!db.objectStoreNames.contains('foodEntries')) {
        const foodStore = db.createObjectStore('foodEntries', { keyPath: 'id' })
        foodStore.createIndex('date', 'date')
        foodStore.createIndex('timestamp', 'timestamp')
      }

      // Food Items store
      if (!db.objectStoreNames.contains('foodItems')) {
        const itemsStore = db.createObjectStore('foodItems', { keyPath: 'id' })
        itemsStore.createIndex('isCustom', 'isCustom')
      }

      // Routines store
      if (!db.objectStoreNames.contains('routines')) {
        db.createObjectStore('routines', { keyPath: 'id' })
      }

      // Exercises store (prepopulated + custom)
      if (!db.objectStoreNames.contains('exercises')) {
        const exercisesStore = db.createObjectStore('exercises', { keyPath: 'id' })
        exercisesStore.createIndex('isCustom', 'isCustom')
      }

      // Machines store (prepopulated + custom)
      if (!db.objectStoreNames.contains('machines')) {
        const machinesStore = db.createObjectStore('machines', { keyPath: 'id' })
        machinesStore.createIndex('isCustom', 'isCustom')
      }
    },
  })
}

// Food Entries operations
export const addFoodEntry = async (entry) => {
  const db = await initDB()
  return db.add('foodEntries', entry)
}

export const getFoodEntriesByDate = async (date) => {
  const db = await initDB()
  return db.getAllFromIndex('foodEntries', 'date', date)
}

export const getAllFoodEntries = async () => {
  const db = await initDB()
  return db.getAll('foodEntries')
}

export const updateFoodEntry = async (entry) => {
  const db = await initDB()
  return db.put('foodEntries', entry)
}

export const deleteFoodEntry = async (id) => {
  const db = await initDB()
  return db.delete('foodEntries', id)
}

// Food Items operations
export const addFoodItem = async (item) => {
  const db = await initDB()
  return db.add('foodItems', item)
}

export const getAllFoodItems = async () => {
  const db = await initDB()
  return db.getAll('foodItems')
}

export const getFoodItem = async (id) => {
  const db = await initDB()
  return db.get('foodItems', id)
}

export const updateFoodItem = async (item) => {
  const db = await initDB()
  return db.put('foodItems', item)
}

export const deleteFoodItem = async (id) => {
  const db = await initDB()
  return db.delete('foodItems', id)
}

// Routines operations
export const addRoutine = async (routine) => {
  const db = await initDB()
  return db.add('routines', routine)
}

export const getAllRoutines = async () => {
  const db = await initDB()
  return db.getAll('routines')
}

export const getRoutine = async (id) => {
  const db = await initDB()
  return db.get('routines', id)
}

export const updateRoutine = async (routine) => {
  const db = await initDB()
  return db.put('routines', routine)
}

export const deleteRoutine = async (id) => {
  const db = await initDB()
  return db.delete('routines', id)
}

// Exercises operations
export const addExercise = async (exercise) => {
  const db = await initDB()
  return db.add('exercises', exercise)
}

export const getAllExercises = async () => {
  const db = await initDB()
  return db.getAll('exercises')
}

export const getExercise = async (id) => {
  const db = await initDB()
  return db.get('exercises', id)
}

export const updateExercise = async (exercise) => {
  const db = await initDB()
  return db.put('exercises', exercise)
}

export const deleteExercise = async (id) => {
  const db = await initDB()
  return db.delete('exercises', id)
}

// Machines operations
export const addMachine = async (machine) => {
  const db = await initDB()
  return db.add('machines', machine)
}

export const getAllMachines = async () => {
  const db = await initDB()
  return db.getAll('machines')
}

export const getMachine = async (id) => {
  const db = await initDB()
  return db.get('machines', id)
}

export const updateMachine = async (machine) => {
  const db = await initDB()
  return db.put('machines', machine)
}

export const deleteMachine = async (id) => {
  const db = await initDB()
  return db.delete('machines', id)
}

// Bulk operations for prepopulating data
export const bulkAddExercises = async (exercises) => {
  const db = await initDB()
  const tx = db.transaction('exercises', 'readwrite')
  await Promise.all(exercises.map(exercise => tx.store.add(exercise)))
  await tx.done
}

export const bulkAddMachines = async (machines) => {
  const db = await initDB()
  const tx = db.transaction('machines', 'readwrite')
  await Promise.all(machines.map(machine => tx.store.add(machine)))
  await tx.done
}

export const bulkAddFoodItems = async (items) => {
  const db = await initDB()
  const tx = db.transaction('foodItems', 'readwrite')
  await Promise.all(items.map(item => tx.store.add(item)))
  await tx.done
}
