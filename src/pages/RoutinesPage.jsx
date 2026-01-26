import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import ImageMuscleDiagram from '../components/ImageMuscleDiagram'
import { getAllRoutines, addRoutine, updateRoutine, deleteRoutine, getAllExercises } from '../utils/db'
import { generateId, calculateVolume, sortVolumeMap, formatMuscleName } from '../utils/helpers'
import './RoutinesPage.css'

const RoutinesPage = () => {
  const [routines, setRoutines] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedRoutine, setSelectedRoutine] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false)
  const [showSetsModal, setShowSetsModal] = useState(false)
  const [selectedExerciseForAdd, setSelectedExerciseForAdd] = useState(null)
  const [numDays, setNumDays] = useState(3)
  const [sets, setSets] = useState([{ reps: 10 }])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const routineData = await getAllRoutines()
    const exerciseData = await getAllExercises()
    setRoutines(routineData)
    setExercises(exerciseData)
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
    setSets([{ reps: 10 }])
  }

  const handleAddSet = () => {
    setSets([...sets, { reps: 10 }])
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
      updatedRoutine.days[dayIndex].exercises.push({
        exerciseId: selectedExerciseForAdd.id,
        machineId: null,
        sets: sets
      })
      updatedRoutine.updatedAt = new Date().toISOString()

      await updateRoutine(updatedRoutine)
      await loadData()
      setSelectedRoutine(updatedRoutine)
      setShowSetsModal(false)
      setSelectedExerciseForAdd(null)
      setSets([{ reps: 10 }])
    }
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
              <div className="empty-icon">📋</div>
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
      const sortedVolume = sortVolumeMap(volumeMap)

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
            <button className="delete-btn-icon" onClick={handleDeleteRoutine}>
              🗑️
            </button>
          </div>

          <div className="volume-summary">
            <h3>Total Volume per Muscle</h3>
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
                return exercise ? (
                  <div key={idx} className="exercise-item-day">
                    <div className="exercise-name-day">{exercise.name}</div>
                    <div className="exercise-sets-day">
                      {ex.sets.length} × {ex.sets[0].reps ? `${ex.sets[0].reps} reps` : `${ex.sets[0].duration}s`}
                    </div>
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
        <div className="modal-overlay" onClick={() => setShowAddExerciseModal(false)}>
          <div className="modal-content-exercise" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-sticky">
              <button className="back-btn" onClick={() => setShowAddExerciseModal(false)}>
                ← Cancel
              </button>
              <h2>Select Exercise</h2>
            </div>
            <div className="exercise-list-modal">
              {exercises.map(exercise => (
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
              ))}
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
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmAddExercise}
              >
                Add to Day
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RoutinesPage
