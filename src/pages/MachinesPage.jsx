import { useState, useEffect } from 'react'
import SplitLayout from '../components/SplitLayout'
import MuscleDiagram from '../components/MuscleDiagram'
import { getAllMachines, getAllExercises } from '../utils/db'
import { getSelectedMachines, setSelectedMachines } from '../utils/storage'
import './MachinesPage.css'

const MachinesPage = () => {
  const [machines, setMachines] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedMachines, setSelectedMachinesState] = useState([])
  const [infoMachine, setInfoMachine] = useState(null)

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

  const leftContent = (
    <div className="machines-list">
      <div className="page-header">
        <h1>Machines</h1>
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
              {selectedMachines.includes(machine.id) ? '✓' : '○'}
            </div>
            <div className="machine-info">
              <div className="machine-name">{machine.name}</div>
              {machine.variants && machine.variants.length > 0 && (
                <div className="machine-variants">
                  {machine.variants.length} variant{machine.variants.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <button
              className="info-btn"
              onClick={(e) => handleInfoClick(e, machine)}
            >
              ℹ️
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const rightContent = (
    <MuscleDiagram />
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
                      <div key={exercise.id} className="exercise-item-modal">
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
    </>
  )
}

export default MachinesPage
