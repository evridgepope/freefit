import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import MuscleDiagram from '../components/MuscleDiagram'
import { getAllExercises, getAllMachines } from '../utils/db'
import { getSelectedMachines } from '../utils/storage'
import { formatMuscleName } from '../utils/helpers'
import './ExercisesPage.css'

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([])
  const [machines, setMachines] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [filteredExercises, setFilteredExercises] = useState([])
  const [filters, setFilters] = useState({
    muscle: null,
    equipment: [],
    type: null, // 'dynamic' or 'static'
    category: null // 'compound' or 'isolation'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [exercises, filters])

  const loadData = async () => {
    const exerciseData = await getAllExercises()
    const machineData = await getAllMachines()
    setExercises(exerciseData)
    setMachines(machineData)
  }

  const applyFilters = () => {
    let filtered = [...exercises]

    // Filter by muscle
    if (filters.muscle) {
      filtered = filtered.filter(ex =>
        ex.primaryMuscles?.includes(filters.muscle) ||
        ex.secondaryMuscles?.includes(filters.muscle)
      )
    }

    // Filter by equipment
    if (filters.equipment.length > 0) {
      filtered = filtered.filter(ex => {
        // Bodyweight exercises always included
        if (!ex.compatibleMachines || ex.compatibleMachines.length === 0) {
          return true
        }
        // Check if any of the exercise's machines match selected equipment
        return ex.compatibleMachines.some(machineId =>
          filters.equipment.includes(machineId)
        )
      })
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(ex => ex.type === filters.type)
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(ex => ex.category === filters.category)
    }

    setFilteredExercises(filtered)
  }

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(selectedExercise?.id === exercise.id ? null : exercise)
  }

  const handleMuscleClick = (muscleId) => {
    setFilters(prev => ({
      ...prev,
      muscle: prev.muscle === muscleId ? null : muscleId
    }))
  }

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }))
  }

  const clearFilters = () => {
    setFilters({
      muscle: null,
      equipment: [],
      type: null,
      category: null
    })
    setSelectedExercise(null)
  }

  const getHighlightedMuscles = () => {
    if (!selectedExercise) return []
    return [
      ...(selectedExercise.primaryMuscles || []),
      ...(selectedExercise.secondaryMuscles || [])
    ]
  }

  const getExerciseIcon = (type) => {
    return type === 'dynamic' ? '🏃' : '⏱️'
  }

  const getCategoryIcon = (category) => {
    return category === 'compound' ? '🔗' : '🎯'
  }

  const activeFilterCount = () => {
    let count = 0
    if (filters.muscle) count++
    if (filters.equipment.length > 0) count++
    if (filters.type) count++
    if (filters.category) count++
    return count
  }

  const leftContent = (
    <div className="exercises-list">
      <div className="page-header">
        <h1>Exercises</h1>
        <div className="header-actions">
          <button
            className={`filter-btn ${showFilters || activeFilterCount() > 0 ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {activeFilterCount() > 0 ? `(${activeFilterCount()})` : ''}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <div className="filter-label">Type</div>
            <div className="filter-options">
              <button
                className={`filter-chip ${filters.type === 'dynamic' ? 'active' : ''}`}
                onClick={() => toggleFilter('type', 'dynamic')}
              >
                🏃 Dynamic
              </button>
              <button
                className={`filter-chip ${filters.type === 'static' ? 'active' : ''}`}
                onClick={() => toggleFilter('type', 'static')}
              >
                ⏱️ Static
              </button>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-label">Category</div>
            <div className="filter-options">
              <button
                className={`filter-chip ${filters.category === 'compound' ? 'active' : ''}`}
                onClick={() => toggleFilter('category', 'compound')}
              >
                🔗 Compound
              </button>
              <button
                className={`filter-chip ${filters.category === 'isolation' ? 'active' : ''}`}
                onClick={() => toggleFilter('category', 'isolation')}
              >
                🎯 Isolation
              </button>
            </div>
          </div>

          {activeFilterCount() > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}

      <div className="exercise-count">
        {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
      </div>

      <div className="scrollable">
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            className={`list-item ${selectedExercise?.id === exercise.id ? 'selected' : ''}`}
            onClick={() => handleExerciseClick(exercise)}
          >
            <div className="exercise-content">
              <div className="exercise-header">
                <div className="exercise-name">{exercise.name}</div>
                <div className="exercise-meta">
                  {getExerciseIcon(exercise.type)} {exercise.type} • {getCategoryIcon(exercise.category)} {exercise.category}
                </div>
              </div>

              {selectedExercise?.id === exercise.id && (
                <div className="exercise-details">
                  <div className="detail-section">
                    <div className="detail-label">Primary Muscles</div>
                    <div className="muscle-tags">
                      {exercise.primaryMuscles?.map(muscle => (
                        <span key={muscle} className="muscle-tag primary">
                          {formatMuscleName(muscle)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {exercise.secondaryMuscles?.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-label">Secondary Muscles</div>
                      <div className="muscle-tags">
                        {exercise.secondaryMuscles.map(muscle => (
                          <span key={muscle} className="muscle-tag secondary">
                            {formatMuscleName(muscle)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-section">
                    <div className="detail-label">Compatible Equipment</div>
                    <div className="equipment-list">
                      {exercise.compatibleMachines?.length > 0 ? (
                        exercise.compatibleMachines.map(machineId => {
                          const machine = machines.find(m => m.id === machineId)
                          return machine ? (
                            <div key={machineId} className="equipment-item">
                              • {machine.name}
                            </div>
                          ) : null
                        })
                      ) : (
                        <div className="equipment-item">• Bodyweight</div>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <div className="detail-label">Instructions</div>
                    <div className="instructions">
                      {exercise.instructions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">No exercises found</p>
            <p className="empty-hint">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )

  const rightContent = (
    <MuscleDiagram
      highlightedMuscles={getHighlightedMuscles()}
      onMuscleClick={handleMuscleClick}
      selectedMuscle={filters.muscle}
    />
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default ExercisesPage
