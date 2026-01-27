import { bulkAddExercises, bulkAddMachines, bulkAddFoodItems, addFoodEntry, getAllExercises, getAllMachines, getAllFoodItems, getAllFoodEntries } from './db'
import { isAppInitialized, setAppInitialized } from './storage'
import { exercises } from '../data/exercises'
import { machines } from '../data/machines'
import { foodItems } from '../data/foodItems'
import { generateId } from './helpers'

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

    // Check if food items exist
    const existingFoodItems = await getAllFoodItems()
    if (existingFoodItems.length === 0) {
      console.log('Adding food items...')
      await bulkAddFoodItems(foodItems)
      console.log(`Added ${foodItems.length} food items`)
    }

    // Add test food entries for history
    const existingEntries = await getAllFoodEntries()
    console.log(`Found ${existingEntries.length} existing food entries`)
    if (existingEntries.length === 0) {
      console.log('Adding test food entries...')

      try {

      // Get dates for testing
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayDate = yesterday.toISOString().split('T')[0]

      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      const twoDaysAgoDate = twoDaysAgo.toISOString().split('T')[0]

      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const threeDaysAgoDate = threeDaysAgo.toISOString().split('T')[0]

      // Test entries for 3 days ago
      const entry1 = {
        id: generateId(),
        foodItemId: 'food_chicken_breast',
        servings: 2,
        timestamp: new Date(threeDaysAgoDate + 'T12:30:00Z').toISOString(),
        date: threeDaysAgoDate,
        totalCalories: 330,
        totalProtein: 62,
        totalFat: 7.2,
        totalCarbs: 0
      }

      const entry2 = {
        id: generateId(),
        foodItemId: 'food_brown_rice',
        servings: 1.5,
        timestamp: new Date(threeDaysAgoDate + 'T12:35:00Z').toISOString(),
        date: threeDaysAgoDate,
        totalCalories: 168,
        totalProtein: 3.9,
        totalFat: 1.4,
        totalCarbs: 35.3
      }

      const entry3 = {
        id: generateId(),
        foodItemId: 'food_broccoli',
        servings: 1,
        timestamp: new Date(threeDaysAgoDate + 'T12:40:00Z').toISOString(),
        date: threeDaysAgoDate,
        totalCalories: 34,
        totalProtein: 2.8,
        totalFat: 0.4,
        totalCarbs: 6.6
      }

      // Test entries for 2 days ago
      const entry4 = {
        id: generateId(),
        foodItemId: 'food_salmon',
        servings: 1.5,
        timestamp: new Date(twoDaysAgoDate + 'T18:00:00Z').toISOString(),
        date: twoDaysAgoDate,
        totalCalories: 312,
        totalProtein: 30,
        totalFat: 19.5,
        totalCarbs: 0
      }

      const entry5 = {
        id: generateId(),
        foodItemId: 'food_sweet_potato',
        servings: 2,
        timestamp: new Date(twoDaysAgoDate + 'T18:05:00Z').toISOString(),
        date: twoDaysAgoDate,
        totalCalories: 180,
        totalProtein: 4,
        totalFat: 0.4,
        totalCarbs: 41.4
      }

      // Test entries for yesterday
      const entry6 = {
        id: generateId(),
        foodItemId: 'food_greek_yogurt',
        servings: 2,
        timestamp: new Date(yesterdayDate + 'T08:00:00Z').toISOString(),
        date: yesterdayDate,
        totalCalories: 118,
        totalProtein: 20,
        totalFat: 0.8,
        totalCarbs: 7.2
      }

      const entry7 = {
        id: generateId(),
        foodItemId: 'food_banana',
        servings: 1,
        timestamp: new Date(yesterdayDate + 'T08:10:00Z').toISOString(),
        date: yesterdayDate,
        totalCalories: 105,
        totalProtein: 1.3,
        totalFat: 0.4,
        totalCarbs: 27
      }

      const entry8 = {
        id: generateId(),
        foodItemId: 'food_ground_beef',
        servings: 1.5,
        timestamp: new Date(yesterdayDate + 'T13:00:00Z').toISOString(),
        date: yesterdayDate,
        totalCalories: 381,
        totalProtein: 25.5,
        totalFat: 30,
        totalCarbs: 0
      }

        // Add all test entries
        const testEntries = [entry1, entry2, entry3, entry4, entry5, entry6, entry7, entry8]
        for (const entry of testEntries) {
          await addFoodEntry(entry)
        }

        console.log('Added 8 test food entries')
      } catch (error) {
        console.error('Error adding test food entries:', error)
      }
    }

    // Mark as initialized
    setAppInitialized(true)
    console.log('App initialization complete')

  } catch (error) {
    console.error('Error initializing app data:', error)
  }
}
