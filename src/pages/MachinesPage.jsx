import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import ImageMuscleDiagram from '../components/ImageMuscleDiagram'
import { getAllMachines, getAllExercises, addMachine, updateMachine, deleteMachine } from '../utils/db'
import { getSelectedMachines, setSelectedMachines } from '../utils/storage'
import { generateId } from '../utils/helpers'
import './MachinesPage.css'

const MachinesPage = ({ onExerciseClick }) => {
  const [machines, setMachines] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedMachines, setSelectedMachinesState] = useState([])
  const [infoMachine, setInfoMachine] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMachine, setEditingMachine] = useState(null)
  const [newMachineName, setNewMachineName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const machineData = await getAllMachines()
    const exerciseData = await getAllExercises()
    const selected = getSelectedMachines()

    setMachines(machineData)
    setExercises(exerciseData)
    setSelectedMachinesState(selected)
  }

  const toggleMachine = (machineId) => {
    const newSelected = selectedMachines.includes(machineId)
      ? selectedMachines.filter(id => id !== machineId)
      : [...selectedMachines, machineId]

    setSelectedMachinesState(newSelected)
    setSelectedMachines(newSelected)
  }

  const handleInfoClick = (e, machine) => {
    e.stopPropagation()
    setInfoMachine(machine)
  }

  const closeInfo = () => {
    setInfoMachine(null)
  }

  const getCompatibleExercises = (machine) => {
    return exercises.filter(ex =>
      ex.compatibleMachines?.includes(machine.id)
    )
  }

  const handleCreateMachine = async () => {
    if (!newMachineName.trim()) {
      alert('Please enter a machine name')
      return
    }

    const newMachine = {
      id: generateId(),
      name: newMachineName.trim(),
      isCustom: true,
      variants: [],
      examplePhotos: [],
      compatibleExercises: selectedExercises
    }

    await addMachine(newMachine)
    await loadData()

    // Reset form and close modal
    setNewMachineName('')
    setSelectedExercises([])
    setShowCreateModal(false)
  }

  const handleEditClick = (e, machine) => {
    e.stopPropagation()
    setEditingMachine(machine)
    setNewMachineName(machine.name)
    setSelectedExercises(machine.compatibleExercises || [])
    setShowEditModal(true)
  }

  const handleUpdateMachine = async () => {
    if (!newMachineName.trim()) {
      alert('Please enter a machine name')
      return
    }

    const updatedMachine = {
      ...editingMachine,
      name: newMachineName.trim(),
      compatibleExercises: selectedExercises
    }

    await updateMachine(updatedMachine)
    await loadData()

    // Reset form and close modal
    setNewMachineName('')
    setSelectedExercises([])
    setEditingMachine(null)
    setShowEditModal(false)
  }

  const handleDeleteMachine = async (machine) => {
    if (!machine.isCustom) {
      alert('Cannot delete standard machines. You can only delete custom machines you created.')
      return
    }

    if (!window.confirm(`Delete "${machine.name}"? This cannot be undone.`)) {
      return
    }

    await deleteMachine(machine.id)
    await loadData()
    setShowEditModal(false)
    setEditingMachine(null)
  }

  const toggleExerciseSelection = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const leftContent = (
    <div className="machines-list">
      <div className="page-header">
        <h1>Machines</h1>
        <button
          className="add-btn-header"
          onClick={() => setShowCreateModal(true)}
        >
          +
        </button>
      </div>

      <div className="machine-count">
        {selectedMachines.length} of {machines.length} selected
      </div>

      <div className="scrollable">
        {machines.map(machine => (
          <div
            key={machine.id}
            className={`list-item machine-item ${selectedMachines.includes(machine.id) ? 'selected' : ''}`}
            onClick={() => toggleMachine(machine.id)}
          >
            <div className="machine-checkbox">
              {selectedMachines.includes(machine.id) ? '[X]' : '[ ]'}
            </div>
            <div className="machine-info">
              <div className="machine-name">
                {machine.name}
                {machine.isCustom && <span className="custom-badge">Custom</span>}
              </div>
              {machine.compatibleExercises && machine.compatibleExercises.length > 0 && (
                <div className="machine-variants">
                  {machine.compatibleExercises.length} exercise{machine.compatibleExercises.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            <div className="machine-actions">
              <button
                className="edit-icon-btn"
                onClick={(e) => handleEditClick(e, machine)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="info-btn"
                onClick={(e) => handleInfoClick(e, machine)}
              >
                Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const rightContent = (
    <ImageMuscleDiagram />
  )

  return (
    <>
      <SplitLayout leftContent={leftContent} rightContent={rightContent} />

      {infoMachine && (
        <div className="modal-overlay" onClick={closeInfo}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="back-btn" onClick={closeInfo}>
                ← Back
              </button>
              <h2>{infoMachine.name}</h2>
            </div>

            <div className="modal-body">
              {infoMachine.variants && infoMachine.variants.length > 0 && (
                <div className="info-section">
                  <h3>Variants</h3>
                  <ul className="variants-list">
                    {infoMachine.variants.map(variant => (
                      <li key={variant.id}>{variant.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="info-section">
                <h3>Compatible Exercises</h3>
                <div className="exercises-list-modal">
                  {getCompatibleExercises(infoMachine).length > 0 ? (
                    getCompatibleExercises(infoMachine).map(exercise => (
                      <div
                        key={exercise.id}
                        className="exercise-item-modal clickable"
                        onClick={() => {
                          if (onExerciseClick) {
                            closeInfo()
                            onExerciseClick(exercise.id)
                          }
                        }}
                      >
                        <div className="exercise-name-modal">{exercise.name}</div>
                        <div className="exercise-meta-modal">
                          {exercise.type} • {exercise.category}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-exercises">No compatible exercises found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Machine Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-create" onClick={(e) => e.stopPropagation()}>
            <h2>Add Custom Machine</h2>

            <div className="modal-form">
              <label>Machine Name</label>
              <input
                type="text"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
                placeholder="e.g., Leg Press Machine"
                className="text-input"
              />

              <label>Compatible Exercises (Optional)</label>
              <div className="exercise-selection-list">
                {exercises.length > 0 ? (
                  exercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className={`exercise-select-item ${selectedExercises.includes(exercise.id) ? 'selected' : ''}`}
                      onClick={() => toggleExerciseSelection(exercise.id)}
                    >
                      <div className="exercise-select-checkbox">
                        {selectedExercises.includes(exercise.id) ? '[X]' : '[ ]'}
                      </div>
                      <div className="exercise-select-info">
                        <div className="exercise-select-name">{exercise.name}</div>
                        <div className="exercise-select-meta">{exercise.type} • {exercise.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-exercises">No exercises available</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowCreateModal(false)
                  setNewMachineName('')
                  setSelectedExercises([])
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreateMachine}
              >
                Create Machine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Machine Modal */}
      {showEditModal && editingMachine && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-create" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Machine</h2>

            <div className="modal-form">
              <label>Machine Name</label>
              <input
                type="text"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
                placeholder="e.g., Leg Press Machine"
                className="text-input"
              />

              <label>Compatible Exercises</label>
              <div className="exercise-selection-list">
                {exercises.length > 0 ? (
                  exercises.map(exercise => (
                    <div
                      key={exercise.id}
                      className={`exercise-select-item ${selectedExercises.includes(exercise.id) ? 'selected' : ''}`}
                      onClick={() => toggleExerciseSelection(exercise.id)}
                    >
                      <div className="exercise-select-checkbox">
                        {selectedExercises.includes(exercise.id) ? '[X]' : '[ ]'}
                      </div>
                      <div className="exercise-select-info">
                        <div className="exercise-select-name">{exercise.name}</div>
                        <div className="exercise-select-meta">{exercise.type} • {exercise.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-exercises">No exercises available</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              {editingMachine.isCustom && (
                <button
                  className="btn-destructive"
                  onClick={() => handleDeleteMachine(editingMachine)}
                >
                  Delete
                </button>
              )}
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingMachine(null)
                  setNewMachineName('')
                  setSelectedExercises([])
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleUpdateMachine}
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

export default MachinesPage
