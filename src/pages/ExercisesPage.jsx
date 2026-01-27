import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import ImageMuscleDiagram from '../components/ImageMuscleDiagram'
import { getAllExercises, getAllMachines, addExercise, updateExercise, deleteExercise } from '../utils/db'
import { getSelectedMachines } from '../utils/storage'
import { formatMuscleName, generateId, MUSCLE_GROUPS } from '../utils/helpers'
import './ExercisesPage.css'

const ExercisesPage = ({ preSelectedExerciseId, onExerciseSelected }) => {
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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: [],
    secondaryMuscles: [],
    compatibleMachines: [],
    instructions: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [exercises, filters])

  useEffect(() => {
    if (preSelectedExerciseId && exercises.length > 0) {
      const exercise = exercises.find(ex => ex.id === preSelectedExerciseId)
      if (exercise) {
        setSelectedExercise(exercise)
        if (onExerciseSelected) {
          onExerciseSelected()
        }
      }
    }
  }, [preSelectedExerciseId, exercises, onExerciseSelected])

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

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'dynamic',
      category: 'compound',
      primaryMuscles: [],
      secondaryMuscles: [],
      compatibleMachines: [],
      instructions: ''
    })
  }

  const handleCreateExercise = async () => {
    if (!formData.name.trim()) {
      alert('Please enter an exercise name')
      return
    }

    const newExercise = {
      id: generateId(),
      ...formData,
      name: formData.name.trim(),
      instructions: formData.instructions.trim(),
      isCustom: true
    }

    await addExercise(newExercise)
    await loadData()
    resetForm()
    setShowCreateModal(false)
  }

  const handleEditClick = (exercise) => {
    if (exercise.isCustom) {
      setEditingExercise(exercise)
      setFormData({
        name: exercise.name,
        type: exercise.type,
        category: exercise.category,
        primaryMuscles: exercise.primaryMuscles || [],
        secondaryMuscles: exercise.secondaryMuscles || [],
        compatibleMachines: exercise.compatibleMachines || [],
        instructions: exercise.instructions || ''
      })
      setShowEditModal(true)
    }
  }

  const handleUpdateExercise = async () => {
    if (!formData.name.trim()) {
      alert('Please enter an exercise name')
      return
    }

    const updatedExercise = {
      ...editingExercise,
      ...formData,
      name: formData.name.trim(),
      instructions: formData.instructions.trim()
    }

    await updateExercise(updatedExercise)
    await loadData()
    resetForm()
    setEditingExercise(null)
    setShowEditModal(false)
    setSelectedExercise(null)
  }

  const handleDeleteExercise = async (exercise) => {
    if (!window.confirm(`Delete "${exercise.name}"? This cannot be undone.`)) {
      return
    }

    await deleteExercise(exercise.id)
    await loadData()
    setShowEditModal(false)
    setEditingExercise(null)
    setSelectedExercise(null)
  }

  const toggleMuscleSelection = (muscleId, isPrimary) => {
    const field = isPrimary ? 'primaryMuscles' : 'secondaryMuscles'
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(muscleId)
        ? prev[field].filter(id => id !== muscleId)
        : [...prev[field], muscleId]
    }))
  }

  const toggleMachineSelection = (machineId) => {
    setFormData(prev => ({
      ...prev,
      compatibleMachines: prev.compatibleMachines.includes(machineId)
        ? prev.compatibleMachines.filter(id => id !== machineId)
        : [...prev.compatibleMachines, machineId]
    }))
  }

  const getAllMuscles = () => {
    const allMuscles = []
    Object.values(MUSCLE_GROUPS).forEach(muscles => {
      allMuscles.push(...muscles)
    })
    return allMuscles
  }

  const getHighlightedMuscles = () => {
    if (!selectedExercise) return []
    return [
      ...(selectedExercise.primaryMuscles || []),
      ...(selectedExercise.secondaryMuscles || [])
    ]
  }

  const getExerciseIcon = (type) => {
    return type === 'dynamic' ? 'D' : 'S'
  }

  const getCategoryIcon = (category) => {
    return category === 'compound' ? 'C' : 'I'
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
            className="add-btn-header"
            onClick={() => setShowCreateModal(true)}
          >
            +
          </button>
          <button
            className={`filter-btn ${showFilters || activeFilterCount() > 0 ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter {activeFilterCount() > 0 ? `(${activeFilterCount()})` : ''}
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
                Dynamic
              </button>
              <button
                className={`filter-chip ${filters.type === 'static' ? 'active' : ''}`}
                onClick={() => toggleFilter('type', 'static')}
              >
                Static
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
                Compound
              </button>
              <button
                className={`filter-chip ${filters.category === 'isolation' ? 'active' : ''}`}
                onClick={() => toggleFilter('category', 'isolation')}
              >
                Isolation
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
                <div className="exercise-name-container">
                  <div className="exercise-name">
                    {exercise.name}
                    {exercise.isCustom && <span className="custom-badge">Custom</span>}
                  </div>
                  {exercise.isCustom && selectedExercise?.id === exercise.id && (
                    <button
                      className="edit-exercise-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(exercise)
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
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
            <p className="empty-text">No exercises found</p>
            <p className="empty-hint">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )

  const rightContent = (
    <ImageMuscleDiagram
      highlightedMuscles={getHighlightedMuscles()}
      onMuscleClick={handleMuscleClick}
      selectedMuscle={filters.muscle}
    />
  )

  return (
    <>
      <SplitLayout leftContent={leftContent} rightContent={rightContent} />

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-exercise-form" onClick={(e) => e.stopPropagation()}>
            <h2>Create Custom Exercise</h2>

            <div className="modal-form-scroll">
              <div className="form-group">
                <label>Exercise Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Bulgarian Split Squat"
                  className="text-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="select-input"
                  >
                    <option value="dynamic">Dynamic</option>
                    <option value="static">Static</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="select-input"
                  >
                    <option value="compound">Compound</option>
                    <option value="isolation">Isolation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Primary Muscles *</label>
                <div className="muscle-selection">
                  {getAllMuscles().map(muscleId => (
                    <button
                      key={muscleId}
                      className={`muscle-select-btn ${formData.primaryMuscles.includes(muscleId) ? 'selected' : ''}`}
                      onClick={() => toggleMuscleSelection(muscleId, true)}
                    >
                      {formatMuscleName(muscleId)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Secondary Muscles (Optional)</label>
                <div className="muscle-selection">
                  {getAllMuscles().map(muscleId => (
                    <button
                      key={muscleId}
                      className={`muscle-select-btn ${formData.secondaryMuscles.includes(muscleId) ? 'selected' : ''}`}
                      onClick={() => toggleMuscleSelection(muscleId, false)}
                    >
                      {formatMuscleName(muscleId)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Compatible Machines (Optional)</label>
                <div className="machine-selection">
                  {machines.map(machine => (
                    <div
                      key={machine.id}
                      className={`machine-select-item ${formData.compatibleMachines.includes(machine.id) ? 'selected' : ''}`}
                      onClick={() => toggleMachineSelection(machine.id)}
                    >
                      <div className="machine-select-checkbox">
                        {formData.compatibleMachines.includes(machine.id) ? '[X]' : '[ ]'}
                      </div>
                      <div className="machine-select-name">{machine.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Instructions (Optional)</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Brief description of how to perform the exercise..."
                  className="textarea-input"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateExercise}
              >
                Create Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {showEditModal && editingExercise && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-exercise-form" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Exercise</h2>

            <div className="modal-form-scroll">
              <div className="form-group">
                <label>Exercise Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Bulgarian Split Squat"
                  className="text-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="select-input"
                  >
                    <option value="dynamic">Dynamic</option>
                    <option value="static">Static</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="select-input"
                  >
                    <option value="compound">Compound</option>
                    <option value="isolation">Isolation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Primary Muscles *</label>
                <div className="muscle-selection">
                  {getAllMuscles().map(muscleId => (
                    <button
                      key={muscleId}
                      className={`muscle-select-btn ${formData.primaryMuscles.includes(muscleId) ? 'selected' : ''}`}
                      onClick={() => toggleMuscleSelection(muscleId, true)}
                    >
                      {formatMuscleName(muscleId)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Secondary Muscles (Optional)</label>
                <div className="muscle-selection">
                  {getAllMuscles().map(muscleId => (
                    <button
                      key={muscleId}
                      className={`muscle-select-btn ${formData.secondaryMuscles.includes(muscleId) ? 'selected' : ''}`}
                      onClick={() => toggleMuscleSelection(muscleId, false)}
                    >
                      {formatMuscleName(muscleId)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Compatible Machines (Optional)</label>
                <div className="machine-selection">
                  {machines.map(machine => (
                    <div
                      key={machine.id}
                      className={`machine-select-item ${formData.compatibleMachines.includes(machine.id) ? 'selected' : ''}`}
                      onClick={() => toggleMachineSelection(machine.id)}
                    >
                      <div className="machine-select-checkbox">
                        {formData.compatibleMachines.includes(machine.id) ? '[X]' : '[ ]'}
                      </div>
                      <div className="machine-select-name">{machine.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Instructions (Optional)</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  placeholder="Brief description of how to perform the exercise..."
                  className="textarea-input"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-destructive"
                onClick={() => handleDeleteExercise(editingExercise)}
              >
                Delete
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingExercise(null)
                  resetForm()
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleUpdateExercise}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ExercisesPage
