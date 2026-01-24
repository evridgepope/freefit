import { useState } from 'react'
import './MuscleDiagram.css'

const MuscleDiagram = ({ highlightedMuscles = [], onMuscleClick, selectedMuscle }) => {
  const [view, setView] = useState('front')

  // Muscle group definitions
  const muscleGroups = {
    front: [
      { id: 'pectoralis_major_upper', name: 'Upper Chest', x: 50, y: 25, width: 30, height: 8 },
      { id: 'pectoralis_major_lower', name: 'Lower Chest', x: 50, y: 33, width: 30, height: 8 },
      { id: 'anterior_deltoid', name: 'Front Delts', x: 35, y: 23, width: 12, height: 10 },
      { id: 'lateral_deltoid', name: 'Side Delts', x: 33, y: 23, width: 4, height: 10 },
      { id: 'biceps_brachii', name: 'Biceps', x: 35, y: 35, width: 8, height: 15 },
      { id: 'rectus_abdominis', name: 'Abs', x: 50, y: 45, width: 20, height: 18 },
      { id: 'obliques_external', name: 'Obliques', x: 38, y: 50, width: 8, height: 12 },
      { id: 'quadriceps', name: 'Quads', x: 50, y: 68, width: 22, height: 22 },
      { id: 'hip_adductors', name: 'Adductors', x: 48, y: 70, width: 6, height: 15 },
    ],
    back: [
      { id: 'trapezius_upper', name: 'Upper Traps', x: 50, y: 18, width: 25, height: 8 },
      { id: 'trapezius_middle', name: 'Mid Traps', x: 50, y: 26, width: 22, height: 8 },
      { id: 'posterior_deltoid', name: 'Rear Delts', x: 35, y: 23, width: 12, height: 10 },
      { id: 'latissimus_dorsi', name: 'Lats', x: 50, y: 35, width: 30, height: 18 },
      { id: 'rhomboids', name: 'Rhomboids', x: 50, y: 28, width: 15, height: 10 },
      { id: 'erector_spinae', name: 'Lower Back', x: 50, y: 50, width: 12, height: 15 },
      { id: 'triceps_brachii', name: 'Triceps', x: 35, y: 35, width: 8, height: 15 },
      { id: 'gluteus_maximus', name: 'Glutes', x: 50, y: 60, width: 24, height: 12 },
      { id: 'hamstrings', name: 'Hamstrings', x: 50, y: 72, width: 20, height: 18 },
      { id: 'gastrocnemius', name: 'Calves', x: 50, y: 88, width: 16, height: 10 },
    ]
  }

  const isHighlighted = (muscleId) => {
    return highlightedMuscles.includes(muscleId)
  }

  const isSelected = (muscleId) => {
    return selectedMuscle === muscleId
  }

  const handleMuscleClick = (muscleId) => {
    if (onMuscleClick) {
      onMuscleClick(muscleId)
    }
  }

  const getMuscleColor = (muscleId) => {
    if (isSelected(muscleId)) {
      return '#007AFF' // Primary blue for selected
    }
    if (isHighlighted(muscleId)) {
      return '#FF3B30' // Red for highlighted
    }
    return '#E5E5EA' // Default gray
  }

  const currentMuscles = muscleGroups[view]

  return (
    <div className="muscle-diagram">
      <div className="diagram-view-toggle">
        <button
          className={`view-btn ${view === 'front' ? 'active' : ''}`}
          onClick={() => setView('front')}
        >
          Front View
        </button>
        <button
          className={`view-btn ${view === 'back' ? 'active' : ''}`}
          onClick={() => setView('back')}
        >
          Rear View
        </button>
      </div>

      <div className="diagram-container">
        <svg viewBox="0 0 100 100" className="muscle-svg">
          {/* Body outline */}
          {view === 'front' ? (
            <>
              {/* Head */}
              <circle cx="50" cy="10" r="6" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Torso */}
              <ellipse cx="50" cy="40" rx="18" ry="25" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Arms */}
              <rect x="32" y="22" width="5" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              <rect x="63" y="22" width="5" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Legs */}
              <rect x="42" y="65" width="7" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              <rect x="51" y="65" width="7" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
            </>
          ) : (
            <>
              {/* Head */}
              <circle cx="50" cy="10" r="6" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Torso */}
              <ellipse cx="50" cy="40" rx="18" ry="25" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Arms */}
              <rect x="32" y="22" width="5" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              <rect x="63" y="22" width="5" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              {/* Legs */}
              <rect x="42" y="65" width="7" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
              <rect x="51" y="65" width="7" height="30" rx="2" fill="#F2F2F7" stroke="#C6C6C8" strokeWidth="0.5"/>
            </>
          )}

          {/* Clickable muscle groups */}
          {currentMuscles.map((muscle) => (
            <g key={muscle.id}>
              <ellipse
                cx={muscle.x}
                cy={muscle.y}
                rx={muscle.width / 2}
                ry={muscle.height / 2}
                fill={getMuscleColor(muscle.id)}
                fillOpacity={isHighlighted(muscle.id) || isSelected(muscle.id) ? 0.8 : 0.4}
                stroke={isSelected(muscle.id) ? '#007AFF' : '#C6C6C8'}
                strokeWidth={isSelected(muscle.id) ? 0.8 : 0.3}
                className="muscle-region"
                onClick={() => handleMuscleClick(muscle.id)}
                style={{ cursor: onMuscleClick ? 'pointer' : 'default' }}
              />
            </g>
          ))}
        </svg>

        {selectedMuscle && (
          <div className="muscle-label">
            {currentMuscles.find(m => m.id === selectedMuscle)?.name || ''}
          </div>
        )}
      </div>

      {highlightedMuscles.length > 0 && (
        <div className="highlighted-muscles">
          <div className="highlighted-label">Muscles Worked:</div>
          <div className="muscle-list">
            {highlightedMuscles.map(muscleId => {
              const muscle = [...muscleGroups.front, ...muscleGroups.back].find(m => m.id === muscleId)
              return muscle ? (
                <div key={muscleId} className="muscle-chip">
                  {muscle.name}
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MuscleDiagram
