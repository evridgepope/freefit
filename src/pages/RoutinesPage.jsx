import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import ImageMuscleDiagram from '../components/ImageMuscleDiagram'
import { getAllRoutines, addRoutine, updateRoutine, deleteRoutine, getAllExercises, getAllMachines } from '../utils/db'
import { generateId, calculateVolume, sortVolumeMap, formatMuscleName, groupVolumeByBroadGroups, expandBroadGroupVolume } from '../utils/helpers'
import { getSelectedMachines, getVolumeGranularity, setVolumeGranularity } from '../utils/storage'
import './RoutinesPage.css'

const RoutinesPage = () => {
  const [routines, setRoutines] = useState([])
  const [exercises, setExercises] = useState([])
  const [machines, setMachines] = useState([])
  const [selectedRoutine, setSelectedRoutine] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
  const [showSetsModal, setShowSetsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditDaysModal, setShowEditDaysModal] = useState(false)
  const [selectedExerciseForAdd, setSelectedExerciseForAdd] = useState(null)
  const [selectedMachineId, setSelectedMachineId] = useState(null)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null)
  const [numDays, setNumDays] = useState(3)
  const [newNumDays, setNewNumDays] = useState(3)
  const [sets, setSets] = useState([{ reps: 10 }])
  const [filterMode, setFilterMode] = useState('my-machines') // 'my-machines' or 'all'
  const [volumeGranularity, setVolumeGranularityState] = useState(getVolumeGranularity()) // 'individual' or 'broad'
  const [exerciseFilters, setExerciseFilters] = useState({
    muscleGroup: null,
    type: null, // 'dynamic' or 'static'
    category: null // 'compound' or 'isolation'
  })

  const toggleVolumeGranularity = () => {
    const newGranularity = volumeGranularity === 'individual' ? 'broad' : 'individual'
    setVolumeGranularityState(newGranularity)
    setVolumeGranularity(newGranularity)
  }

  const toggleExerciseFilter = (filterType, value) => {
    setExerciseFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }))
  }

  const clearExerciseFilters = () => {
    setExerciseFilters({
      muscleGroup: null,
      type: null,
      category: null
    })
  }

  const handleMuscleClickInModal = (muscleId) => {
    setExerciseFilters(prev => ({
      ...prev,
      muscleGroup: prev.muscleGroup === muscleId ? null : muscleId
    }))
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const routineData = await getAllRoutines()
    const exerciseData = await getAllExercises()
    const machineData = await getAllMachines()
    setRoutines(routineData)
    setExercises(exerciseData)
    setMachines(machineData)
  }

  const handleCreateRoutine = async () => {
    const newRoutine = {
      id: generateId(),
      name: 'New Routine',
      numDays: parseInt(numDays),
      days: Array.from({ length: parseInt(numDays) }, (_, i) => ({
        dayNumber: i + 1,
        exercises: []
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await addRoutine(newRoutine)
    await loadData()
    setShowCreateModal(false)
    setSelectedRoutine(newRoutine)
    setNumDays(3)
  }

  const handleSelectRoutine = (routine) => {
    setSelectedRoutine(routine)
    setSelectedDay(null)
  }

  const handleSelectDay = (dayNumber) => {
    setSelectedDay(dayNumber)
  }

  const handleBack = () => {
    if (selectedDay !== null) {
      setSelectedDay(null)
    } else {
      setSelectedRoutine(null)
    }
  }

  const handleDeleteRoutine = async () => {
    if (window.confirm(`Delete "${selectedRoutine.name}"? This cannot be undone.`)) {
      await deleteRoutine(selectedRoutine.id)
      await loadData()
      setSelectedRoutine(null)
    }
  }

  const handleUpdateRoutineName = async (newName) => {
    const updated = {
      ...selectedRoutine,
      name: newName,
      updatedAt: new Date().toISOString()
    }
    await updateRoutine(updated)
    await loadData()
    setSelectedRoutine(updated)
  }

  const handleAddExerciseClick = () => {
    setShowAddExerciseModal(true)
  }

  const handleSelectExercise = (exercise) => {
    setSelectedExerciseForAdd(exercise)
    setShowAddExerciseModal(false)
    setShowSetsModal(true)

    // Initialize sets based on exercise type
    const initialSet = exercise.type === 'static' ? { duration: 30 } : { reps: 10 }
    setSets([initialSet])

    // Set default machine (first compatible machine or null for bodyweight)
    const compatibleMachines = machines.filter(m =>
      exercise.compatibleMachines && exercise.compatibleMachines.includes(m.id)
    )
    setSelectedMachineId(compatibleMachines.length > 0 ? compatibleMachines[0].id : null)
  }

  const handleAddSet = () => {
    const exercise = exercises.find(e => e.id === selectedExerciseForAdd?.id)
    const newSet = exercise?.type === 'static' ? { duration: 30 } : { reps: 10 }
    setSets([...sets, newSet])
  }

  const handleUpdateSet = (index, value) => {
    const newSets = [...sets]
    const exercise = exercises.find(e => e.id === selectedExerciseForAdd.id)
    if (exercise?.type === 'dynamic') {
      newSets[index] = { reps: parseInt(value) || 0 }
    } else {
      newSets[index] = { duration: parseInt(value) || 0 }
    }
    setSets(newSets)
  }

  const handleRemoveSet = (index) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index))
    }
  }

  const handleConfirmAddExercise = async () => {
    if (!selectedExerciseForAdd || !selectedRoutine || selectedDay === null) return

    const updatedRoutine = { ...selectedRoutine }
    const dayIndex = updatedRoutine.days.findIndex(d => d.dayNumber === selectedDay)

    if (dayIndex !== -1) {
      if (editingExerciseIndex !== null) {
        // Update existing exercise
        updatedRoutine.days[dayIndex].exercises[editingExerciseIndex] = {
          exerciseId: selectedExerciseForAdd.id,
          machineId: selectedMachineId,
          sets: sets
        }
      } else {
        // Add new exercise
        updatedRoutine.days[dayIndex].exercises.push({
          exerciseId: selectedExerciseForAdd.id,
          machineId: selectedMachineId,
          sets: sets
        })
      }
      updatedRoutine.updatedAt = new Date().toISOString()

      await updateRoutine(updatedRoutine)
      await loadData()
      setSelectedRoutine(updatedRoutine)
      setShowSetsModal(false)
      setSelectedExerciseForAdd(null)
      setSelectedMachineId(null)
      setEditingExerciseIndex(null)
      setSets([{ reps: 10 }])
    }
  }

  const handleEditExercise = (exerciseIndex, exercise) => {
    const exerciseData = exercises.find(e => e.id === exercise.exerciseId)
    if (!exerciseData) return

    setEditingExerciseIndex(exerciseIndex)
    setSelectedExerciseForAdd(exerciseData)
    setSelectedMachineId(exercise.machineId)
    setSets(exercise.sets)
    setShowSetsModal(true)
  }

  const handleDeleteExercise = async (exerciseIndex) => {
    if (!window.confirm('Delete this exercise from the day?')) return

    const updatedRoutine = { ...selectedRoutine }
    const dayIndex = updatedRoutine.days.findIndex(d => d.dayNumber === selectedDay)

    if (dayIndex !== -1) {
      updatedRoutine.days[dayIndex].exercises.splice(exerciseIndex, 1)
      updatedRoutine.updatedAt = new Date().toISOString()

      await updateRoutine(updatedRoutine)
      await loadData()
      setSelectedRoutine(updatedRoutine)
    }
  }

  const handleEditRoutineDays = () => {
    setNewNumDays(selectedRoutine.numDays)
    setShowEditDaysModal(true)
  }

  const handleConfirmEditDays = async () => {
    const newNum = parseInt(newNumDays)
    const currentNum = selectedRoutine.numDays

    if (newNum === currentNum) {
      setShowEditDaysModal(false)
      return
    }

    if (newNum < currentNum) {
      // Warn about deleting days
      const daysToDelete = currentNum - newNum
      if (!window.confirm(`This will delete ${daysToDelete} day(s) (Day ${newNum + 1} to Day ${currentNum}). Continue?`)) {
        return
      }
    }

    const updatedRoutine = { ...selectedRoutine }
    updatedRoutine.numDays = newNum

    if (newNum > currentNum) {
      // Add new empty days
      for (let i = currentNum + 1; i <= newNum; i++) {
        updatedRoutine.days.push({
          dayNumber: i,
          exercises: []
        })
      }
    } else {
      // Remove days
      updatedRoutine.days = updatedRoutine.days.filter(d => d.dayNumber <= newNum)
    }

    updatedRoutine.updatedAt = new Date().toISOString()
    await updateRoutine(updatedRoutine)
    await loadData()
    setSelectedRoutine(updatedRoutine)
    setShowEditDaysModal(false)
  }

  const getRoutineVolume = (routine) => {
    return calculateVolume(routine, exercises)
  }

  const getDayVolume = (routine, dayNumber) => {
    const day = routine.days.find(d => d.dayNumber === dayNumber)
    if (!day) return {}

    const singleDayRoutine = {
      ...routine,
      days: [day]
    }
    return calculateVolume(singleDayRoutine, exercises)
  }

  const getDisplayVolume = (volumeMap) => {
    if (volumeGranularity === 'broad') {
      return groupVolumeByBroadGroups(volumeMap)
    }
    return volumeMap
  }

  const getHighlightedMuscles = () => {
    if (selectedDay !== null && selectedRoutine) {
      // Show muscles worked on selected day
      const volumeMap = getDayVolume(selectedRoutine, selectedDay)
      return Object.keys(volumeMap)
    } else if (selectedRoutine) {
      // Show all muscles worked in routine
      const volumeMap = getRoutineVolume(selectedRoutine)
      return Object.keys(volumeMap)
    }
    return []
  }

  const getVolumeMapForDiagram = () => {
    if (selectedDay !== null && selectedRoutine) {
      // For individual days, no gradient (uniform highlighting)
      return {}
    } else if (selectedRoutine) {
      // For routine overview, show gradient
      const volumeMap = getRoutineVolume(selectedRoutine)
      // Expand broad groups if necessary for diagram
      if (volumeGranularity === 'broad') {
        const broadVolume = groupVolumeByBroadGroups(volumeMap)
        return expandBroadGroupVolume(broadVolume)
      }
      return volumeMap
    }
    return {}
  }

  const getFilteredExercises = () => {
    let filtered = exercises

    // Filter by equipment
    if (filterMode === 'my-machines') {
      const userMachineIds = getSelectedMachines()
      filtered = filtered.filter(ex => {
        // Always include bodyweight exercises
        if (!ex.compatibleMachines || ex.compatibleMachines.length === 0) {
          return true
        }
        // Check if any of the exercise's compatible machines match user's machines
        return ex.compatibleMachines.some(machineId => userMachineIds.includes(machineId))
      })
    }

    // Filter by muscle group
    if (exerciseFilters.muscleGroup) {
      filtered = filtered.filter(ex =>
        ex.primaryMuscles?.includes(exerciseFilters.muscleGroup) ||
        ex.secondaryMuscles?.includes(exerciseFilters.muscleGroup)
      )
    }

    // Filter by type (dynamic/static)
    if (exerciseFilters.type) {
      filtered = filtered.filter(ex => ex.type === exerciseFilters.type)
    }

    // Filter by category (compound/isolation)
    if (exerciseFilters.category) {
      filtered = filtered.filter(ex => ex.category === exerciseFilters.category)
    }

    return filtered
  }

  const leftContent = () => {
    // No routine selected - list of routines
    if (!selectedRoutine) {
      return (
        <div className="routines-list">
          <div className="page-header">
            <h1>Routines</h1>
            <button
              className="add-btn-header"
              onClick={() => setShowCreateModal(true)}
            >
              +
            </button>
          </div>

          {routines.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No routines yet</p>
              <p className="empty-hint">Create your first routine to get started</p>
            </div>
          ) : (
            <div className="scrollable">
              {routines.map(routine => (
                <div
                  key={routine.id}
                  className="list-item routine-item"
                  onClick={() => handleSelectRoutine(routine)}
                >
                  <div className="routine-info">
                    <div className="routine-name">{routine.name}</div>
                    <div className="routine-meta">{routine.numDays} days</div>
                  </div>
                  <div className="chevron">›</div>
                </div>
              ))}
            </div>
          )}

          <button
            className="add-btn-fixed"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Routine
          </button>
        </div>
      )
    }

    // Routine selected, no day selected - show days list
    if (selectedDay === null) {
      const volumeMap = getRoutineVolume(selectedRoutine)
      const displayVolume = getDisplayVolume(volumeMap)
      const sortedVolume = sortVolumeMap(displayVolume)

      return (
        <div className="routine-detail">
          <div className="page-header">
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
            <input
              type="text"
              className="routine-name-input"
              value={selectedRoutine.name}
              onChange={(e) => handleUpdateRoutineName(e.target.value)}
            />
            <button className="edit-btn-icon" onClick={handleEditRoutineDays}>
              Edit
            </button>
            <button className="delete-btn-icon" onClick={handleDeleteRoutine}>
              Delete
            </button>
          </div>

          <div className="volume-summary">
            <div className="volume-header">
              <h3>Total Volume per Muscle</h3>
              <button
                className="granularity-toggle"
                onClick={toggleVolumeGranularity}
                title={`Switch to ${volumeGranularity === 'individual' ? 'broad' : 'individual'} view`}
              >
                {volumeGranularity === 'individual' ? 'Detailed' : 'Grouped'}
              </button>
            </div>
            {sortedVolume.length > 0 ? (
              <div className="volume-list">
                {sortedVolume.map(([muscle, sets]) => (
                  <div key={muscle} className="volume-item">
                    <span className="muscle-name">{formatMuscleName(muscle)}</span>
                    <span className="volume-sets">{sets} sets</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-volume">No exercises added yet</p>
            )}
          </div>

          <div className="days-section">
            <h3>Training Days</h3>
            <div className="days-list">
              {selectedRoutine.days.map(day => {
                const dayVolume = getDayVolume(selectedRoutine, day.dayNumber)
                const totalSets = Object.values(dayVolume).reduce((sum, sets) => sum + sets, 0)

                return (
                  <div
                    key={day.dayNumber}
                    className="day-item"
                    onClick={() => handleSelectDay(day.dayNumber)}
                  >
                    <div className="day-info">
                      <div className="day-title">Day {day.dayNumber}</div>
                      <div className="day-meta">
                        {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''} • {totalSets} sets
                      </div>
                    </div>
                    <div className="chevron">›</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // Day selected - show exercises for that day
    const day = selectedRoutine.days.find(d => d.dayNumber === selectedDay)
    const dayVolume = getDayVolume(selectedRoutine, selectedDay)
    const sortedVolume = sortVolumeMap(dayVolume)

    return (
      <div className="day-detail">
        <div className="page-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h2>Day {selectedDay}</h2>
          <div className="filter-toggle">
            <button
              className={`filter-btn ${filterMode === 'my-machines' ? 'active' : ''}`}
              onClick={() => setFilterMode('my-machines')}
            >
              My Machines
            </button>
            <button
              className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All
            </button>
          </div>
        </div>

        <div className="volume-summary">
          <h3>Muscles Worked Today</h3>
          {sortedVolume.length > 0 ? (
            <div className="volume-list">
              {sortedVolume.map(([muscle, sets]) => (
                <div key={muscle} className="volume-item">
                  <span className="muscle-name">{formatMuscleName(muscle)}</span>
                  <span className="volume-sets">{sets} sets</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-volume">No exercises added yet</p>
          )}
        </div>

        <div className="exercises-section">
          <h3>Exercises</h3>
          {day.exercises.length > 0 ? (
            <div className="exercises-list-day">
              {day.exercises.map((ex, idx) => {
                const exercise = exercises.find(e => e.id === ex.exerciseId)
                const machine = ex.machineId ? machines.find(m => m.id === ex.machineId) : null
                return exercise ? (
                  <div key={idx} className="exercise-item-day">
                    <div className="exercise-info-day">
                      <div className="exercise-name-day">{exercise.name}</div>
                      <div className="exercise-meta-day">
                        {machine ? machine.name : 'Bodyweight'} • {ex.sets.length} × {ex.sets[0].reps ? `${ex.sets[0].reps} reps` : `${ex.sets[0].duration}s`}
                      </div>
                    </div>
                    <button
                      className="settings-btn"
                      onClick={() => setShowEditModal(idx)}
                    >
                      •••
                    </button>
                    {showEditModal === idx && (
                      <div className="edit-menu">
                        <button onClick={() => { handleEditExercise(idx, ex); setShowEditModal(false); }}>
                          Edit
                        </button>
                        <button onClick={() => { handleDeleteExercise(idx); setShowEditModal(false); }}>
                          Delete
                        </button>
                        <button onClick={() => setShowEditModal(false)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : null
              })}
            </div>
          ) : (
            <div className="empty-state-small">
              <p>No exercises yet</p>
              <p className="empty-hint">Add exercises to this day</p>
            </div>
          )}

          <button className="add-btn-fixed" onClick={handleAddExerciseClick}>+ Add Exercise</button>
        </div>
      </div>
    )
  }

  const rightContent = (
    <ImageMuscleDiagram
      highlightedMuscles={getHighlightedMuscles()}
      volumeMap={getVolumeMapForDiagram()}
      showGradient={selectedRoutine && selectedDay === null}
    />
  )

  return (
    <>
      <SplitLayout leftContent={leftContent()} rightContent={rightContent} />

      {/* Create Routine Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-routine" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Routine</h2>
            <div className="modal-form">
              <label>How many days in this routine?</label>
              <input
                type="number"
                min="1"
                max="7"
                value={numDays}
                onChange={(e) => setNumDays(e.target.value)}
                className="number-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateRoutine}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="exercise-selector-overlay">
          <div className="exercise-selector-panel">
            <div className="modal-header-sticky">
              <button className="back-btn" onClick={() => { setShowAddExerciseModal(false); clearExerciseFilters(); }}>
                ← Cancel
              </button>
              <h2>Select Exercise</h2>
            </div>

            {/* Filter Section */}
            <div className="exercise-filters">
              <div className="filter-row">
                <span className="filter-label">Type:</span>
                <div className="filter-chips-inline">
                  <button
                    className={`filter-chip-small ${exerciseFilters.type === 'dynamic' ? 'active' : ''}`}
                    onClick={() => toggleExerciseFilter('type', 'dynamic')}
                  >
                    Dynamic
                  </button>
                  <button
                    className={`filter-chip-small ${exerciseFilters.type === 'static' ? 'active' : ''}`}
                    onClick={() => toggleExerciseFilter('type', 'static')}
                  >
                    Static
                  </button>
                </div>
              </div>

              <div className="filter-row">
                <span className="filter-label">Category:</span>
                <div className="filter-chips-inline">
                  <button
                    className={`filter-chip-small ${exerciseFilters.category === 'compound' ? 'active' : ''}`}
                    onClick={() => toggleExerciseFilter('category', 'compound')}
                  >
                    Compound
                  </button>
                  <button
                    className={`filter-chip-small ${exerciseFilters.category === 'isolation' ? 'active' : ''}`}
                    onClick={() => toggleExerciseFilter('category', 'isolation')}
                  >
                    Isolation
                  </button>
                </div>
              </div>

              {(exerciseFilters.muscleGroup || exerciseFilters.type || exerciseFilters.category) && (
                <button className="clear-filters-btn" onClick={clearExerciseFilters}>
                  Clear Filters
                </button>
              )}
            </div>

            <div className="exercise-list-modal">
              {getFilteredExercises().length > 0 ? (
                getFilteredExercises().map(exercise => (
                  <div
                    key={exercise.id}
                    className="list-item exercise-modal-item"
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <div>
                      <div className="exercise-name">{exercise.name}</div>
                      <div className="exercise-meta">
                        {exercise.type} • {exercise.category}
                      </div>
                    </div>
                    <div className="chevron">›</div>
                  </div>
                ))
              ) : (
                <div className="empty-state-small">
                  <p>No exercises match your filters</p>
                  <p className="empty-hint">Try adjusting your filters or selecting a muscle on the diagram</p>
                </div>
              )}
            </div>
          </div>

          {/* Muscle diagram overlay - allows clicking muscles while modal is open */}
          <div className="diagram-overlay-right">
            <ImageMuscleDiagram
              highlightedMuscles={[]}
              selectedMuscle={exerciseFilters.muscleGroup}
              onMuscleClick={handleMuscleClickInModal}
            />
          </div>
        </div>
      )}

      {/* Edit Days Modal */}
      {showEditDaysModal && (
        <div className="modal-overlay" onClick={() => setShowEditDaysModal(false)}>
          <div className="modal-content-routine" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Routine Days</h2>
            <div className="modal-form">
              <label>How many days in this routine?</label>
              <input
                type="number"
                min="1"
                max="7"
                value={newNumDays}
                onChange={(e) => setNewNumDays(e.target.value)}
                className="number-input"
              />
              {parseInt(newNumDays) < selectedRoutine.numDays && (
                <p className="warning-text">
                  Warning: Decreasing days will delete Day {parseInt(newNumDays) + 1} to Day {selectedRoutine.numDays}
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowEditDaysModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmEditDays}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Sets Modal */}
      {showSetsModal && selectedExerciseForAdd && (
        <div className="modal-overlay" onClick={() => setShowSetsModal(false)}>
          <div className="modal-content-routine" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedExerciseForAdd.name}</h2>
            <div className="modal-form">
              <label>Equipment</label>
              <select
                value={selectedMachineId || ''}
                onChange={(e) => setSelectedMachineId(e.target.value || null)}
                className="machine-select"
              >
                <option value="">Bodyweight</option>
                {machines
                  .filter(m => selectedExerciseForAdd.compatibleMachines?.includes(m.id))
                  .map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name}
                    </option>
                  ))}
              </select>

              <label>Configure Sets</label>
              <div className="sets-list">
                {sets.map((set, index) => (
                  <div key={index} className="set-item">
                    <span className="set-number">Set {index + 1}</span>
                    <input
                      type="number"
                      min="1"
                      value={set.reps || set.duration || 0}
                      onChange={(e) => handleUpdateSet(index, e.target.value)}
                      className="set-input"
                      placeholder={selectedExerciseForAdd.type === 'dynamic' ? 'Reps' : 'Seconds'}
                    />
                    <span className="set-unit">
                      {selectedExerciseForAdd.type === 'dynamic' ? 'reps' : 'sec'}
                    </span>
                    {sets.length > 1 && (
                      <button
                        className="remove-set-btn"
                        onClick={() => handleRemoveSet(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="add-set-btn" onClick={handleAddSet}>
                + Add Set
              </button>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowSetsModal(false)
                  setSelectedExerciseForAdd(null)
                  setSelectedMachineId(null)
                  setEditingExerciseIndex(null)
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmAddExercise}
              >
                {editingExerciseIndex !== null ? 'Update' : 'Add to Day'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RoutinesPage
