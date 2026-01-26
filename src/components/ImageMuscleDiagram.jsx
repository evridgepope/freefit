import { useState } from 'react'
import './ImageMuscleDiagram.css'

const ImageMuscleDiagram = ({ highlightedMuscles = [], onMuscleClick, selectedMuscle }) => {
  const [view, setView] = useState('front')

  // Muscle region coordinates (percentage-based for responsive scaling)
  // These coordinates define clickable regions on the anatomy images
  // Format: { x: left%, y: top%, width: width%, height: height% }
  const muscleRegions = {
    front: {
      // CHEST
      pectoralis_major_upper: {
        name: 'Upper Pecs',
        x: 35, y: 23, width: 30, height: 8
      },
      pectoralis_major_lower: {
        name: 'Lower Pecs',
        x: 35, y: 31, width: 30, height: 8
      },

      // SHOULDERS
      anterior_deltoid: {
        name: 'Front Delts',
        x: 25, y: 21, width: 10, height: 10,
        side: 'both' // appears on both sides
      },
      lateral_deltoid: {
        name: 'Side Delts',
        x: 20, y: 21, width: 5, height: 10,
        side: 'both'
      },

      // ARMS
      biceps_brachii: {
        name: 'Biceps',
        x: 18, y: 32, width: 7, height: 15,
        side: 'both'
      },
      forearm_flexors: {
        name: 'Forearms',
        x: 17, y: 48, width: 6, height: 15,
        side: 'both'
      },

      // CORE
      rectus_abdominis: {
        name: 'Abs',
        x: 38, y: 42, width: 24, height: 20
      },
      obliques_external: {
        name: 'Obliques',
        x: 30, y: 45, width: 8, height: 15,
        side: 'both'
      },

      // LEGS
      quadriceps: {
        name: 'Quads',
        x: 35, y: 65, width: 12, height: 22,
        side: 'both'
      },
      hip_adductors: {
        name: 'Adductors',
        x: 43, y: 68, width: 14, height: 15
      },
    },
    back: {
      // UPPER BACK
      trapezius_upper: {
        name: 'Upper Traps',
        x: 35, y: 18, width: 30, height: 8
      },
      trapezius_middle: {
        name: 'Mid Traps',
        x: 37, y: 26, width: 26, height: 8
      },
      trapezius_lower: {
        name: 'Lower Traps',
        x: 40, y: 34, width: 20, height: 6
      },

      // SHOULDERS
      posterior_deltoid: {
        name: 'Rear Delts',
        x: 25, y: 21, width: 10, height: 10,
        side: 'both'
      },

      // MID/LOWER BACK
      latissimus_dorsi: {
        name: 'Lats',
        x: 28, y: 32, width: 15, height: 20,
        side: 'both'
      },
      rhomboids: {
        name: 'Rhomboids',
        x: 40, y: 28, width: 20, height: 10
      },
      erector_spinae: {
        name: 'Lower Back',
        x: 42, y: 45, width: 16, height: 15
      },

      // ARMS
      triceps_brachii: {
        name: 'Triceps',
        x: 18, y: 32, width: 7, height: 15,
        side: 'both'
      },
      forearm_extensors: {
        name: 'Forearms',
        x: 17, y: 48, width: 6, height: 15,
        side: 'both'
      },

      // GLUTES & LEGS
      gluteus_maximus: {
        name: 'Glutes',
        x: 36, y: 52, width: 28, height: 12
      },
      gluteus_medius: {
        name: 'Glute Medius',
        x: 32, y: 50, width: 10, height: 10,
        side: 'both'
      },
      hamstrings: {
        name: 'Hamstrings',
        x: 36, y: 65, width: 11, height: 20,
        side: 'both'
      },
      gastrocnemius: {
        name: 'Calves',
        x: 37, y: 85, width: 9, height: 12,
        side: 'both'
      },
      soleus: {
        name: 'Soleus',
        x: 38, y: 95, width: 8, height: 4,
        side: 'both'
      },
    }
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

  const currentRegions = muscleRegions[view]

  // Render muscle region overlays
  const renderMuscleRegions = () => {
    return Object.entries(currentRegions).map(([muscleId, region]) => {
      const isHigh = isHighlighted(muscleId)
      const isSel = isSelected(muscleId)

      // For bilateral muscles (side: 'both'), render two overlays
      if (region.side === 'both') {
        return (
          <div key={muscleId}>
            {/* Left side */}
            <div
              className={`muscle-overlay ${isHigh ? 'highlighted' : ''} ${isSel ? 'selected' : ''}`}
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.width}%`,
                height: `${region.height}%`,
              }}
              onClick={() => handleMuscleClick(muscleId)}
              title={region.name}
            />
            {/* Right side (mirrored) */}
            <div
              className={`muscle-overlay ${isHigh ? 'highlighted' : ''} ${isSel ? 'selected' : ''}`}
              style={{
                right: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.width}%`,
                height: `${region.height}%`,
              }}
              onClick={() => handleMuscleClick(muscleId)}
              title={region.name}
            />
          </div>
        )
      }

      // For central muscles, render single overlay
      return (
        <div
          key={muscleId}
          className={`muscle-overlay ${isHigh ? 'highlighted' : ''} ${isSel ? 'selected' : ''}`}
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.width}%`,
            height: `${region.height}%`,
          }}
          onClick={() => handleMuscleClick(muscleId)}
          title={region.name}
        />
      )
    })
  }

  return (
    <div className="image-muscle-diagram">
      <div className="diagram-view-toggle">
        <button
          className={`view-btn ${view === 'front' ? 'active' : ''}`}
          onClick={() => setView('front')}
        >
          Front
        </button>
        <button
          className={`view-btn ${view === 'back' ? 'active' : ''}`}
          onClick={() => setView('back')}
        >
          Back
        </button>
      </div>

      <div className="diagram-image-container">
        <div className="image-wrapper">
          <img
            src={`/images/muscles-${view}.png`}
            alt={`${view} muscles`}
            className="muscle-anatomy-image"
          />

          {/* Clickable muscle overlays */}
          <div className="muscle-overlays">
            {renderMuscleRegions()}
          </div>
        </div>

        {selectedMuscle && currentRegions[selectedMuscle] && (
          <div className="selected-muscle-label-image">
            {currentRegions[selectedMuscle].name}
          </div>
        )}
      </div>

      {highlightedMuscles.length > 0 && (
        <div className="highlighted-muscles-image">
          <div className="highlighted-label">Muscles Worked:</div>
          <div className="muscle-list">
            {highlightedMuscles.map(muscleId => {
              const muscle = muscleRegions.front[muscleId] || muscleRegions.back[muscleId]
              return muscle ? (
                <div key={muscleId} className="muscle-chip-image">
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

export default ImageMuscleDiagram
