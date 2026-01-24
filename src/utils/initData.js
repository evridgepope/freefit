import { bulkAddExercises, bulkAddMachines, getAllExercises, getAllMachines } from './db'
import { isAppInitialized, setAppInitialized } from './storage'
import { exercises } from '../data/exercises'
import { machines } from '../data/machines'

// Initialize app data on first run
export const initializeAppData = async () => {
  try {
    // Check if already initialized
    if (isAppInitialized()) {
      console.log('App already initialized')
      return
    }

    console.log('Initializing app data...')

    // Check if exercises exist
    const existingExercises = await getAllExercises()
    if (existingExercises.length === 0) {
      console.log('Adding exercises...')
      await bulkAddExercises(exercises)
      console.log(`Added ${exercises.length} exercises`)
    }

    // Check if machines exist
    const existingMachines = await getAllMachines()
    if (existingMachines.length === 0) {
      console.log('Adding machines...')
      await bulkAddMachines(machines)
      console.log(`Added ${machines.length} machines`)
    }

    // Mark as initialized
    setAppInitialized(true)
    console.log('App initialization complete')

  } catch (error) {
    console.error('Error initializing app data:', error)
  }
}
