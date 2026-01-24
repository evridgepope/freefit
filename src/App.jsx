import { useState, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import ExercisesPage from './pages/ExercisesPage'
import MachinesPage from './pages/MachinesPage'
import RoutinesPage from './pages/RoutinesPage'
import NutritionPage from './pages/NutritionPage'
import { initializeAppData } from './utils/initData'
import './styles/App.css'

function App() {
  const [activeTab, setActiveTab] = useState('exercises')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initApp = async () => {
      await initializeAppData()
      setIsLoading(false)
    }
    initApp()
  }, [])

  const renderPage = () => {
    switch (activeTab) {
      case 'exercises':
        return <ExercisesPage />
      case 'machines':
        return <MachinesPage />
      case 'routines':
        return <RoutinesPage />
      case 'nutrition':
        return <NutritionPage />
      default:
        return <ExercisesPage />
    }
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading FreeFit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <main className="app-content">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
