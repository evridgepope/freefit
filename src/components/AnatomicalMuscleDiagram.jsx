import { useState } from 'react'
import './AnatomicalMuscleDiagram.css'

const AnatomicalMuscleDiagram = ({ highlightedMuscles = [], onMuscleClick, selectedMuscle }) => {
  const [view, setView] = useState('front')

  // Detailed muscle definitions with SVG paths for anatomical accuracy
  const musclePaths = {
    front: {
      // CHEST
      pectoralis_major_upper: {
        name: 'Upper Pecs',
        path: 'M 140,120 Q 150,110 160,115 L 165,125 Q 160,130 150,128 Z M 260,120 Q 250,110 240,115 L 235,125 Q 240,130 250,128 Z',
        center: { x: 200, y: 122 }
      },
      pectoralis_major_lower: {
        name: 'Lower Pecs',
        path: 'M 145,130 Q 155,135 165,132 L 168,145 Q 160,150 150,145 Z M 255,130 Q 245,135 235,132 L 232,145 Q 240,150 250,145 Z',
        center: { x: 200, y: 140 }
      },

      // SHOULDERS
      anterior_deltoid: {
        name: 'Front Delts',
        path: 'M 125,115 Q 130,105 140,110 L 145,125 Q 140,130 130,125 Z M 275,115 Q 270,105 260,110 L 255,125 Q 260,130 270,125 Z',
        center: { x: 200, y: 120 }
      },
      lateral_deltoid: {
        name: 'Side Delts',
        path: 'M 118,115 Q 120,105 128,108 L 130,122 Q 125,125 120,120 Z M 282,115 Q 280,105 272,108 L 270,122 Q 275,125 280,120 Z',
        center: { x: 200, y: 115 }
      },

      // ARMS
      biceps_brachii: {
        name: 'Biceps',
        path: 'M 115,130 Q 118,138 122,145 L 120,165 Q 115,168 110,160 L 108,140 Z M 285,130 Q 282,138 278,145 L 280,165 Q 285,168 290,160 L 292,140 Z',
        center: { x: 200, y: 148 }
      },
      forearm_flexors: {
        name: 'Forearms',
        path: 'M 108,168 Q 110,180 112,195 L 110,210 Q 105,215 100,205 L 98,185 Z M 292,168 Q 290,180 288,195 L 290,210 Q 295,215 300,205 L 302,185 Z',
        center: { x: 200, y: 190 }
      },

      // CORE
      rectus_abdominis: {
        name: 'Abs',
        path: 'M 175,155 L 225,155 L 230,200 L 220,210 L 180,210 L 170,200 Z',
        center: { x: 200, y: 180 }
      },
      obliques_external: {
        name: 'Obliques',
        path: 'M 165,160 Q 155,170 150,185 L 155,200 Q 162,205 170,198 Z M 235,160 Q 245,170 250,185 L 245,200 Q 238,205 230,198 Z',
        center: { x: 200, y: 180 }
      },

      // LEGS
      quadriceps: {
        name: 'Quads',
        path: 'M 170,220 L 185,220 L 188,280 L 180,290 L 172,285 Z M 215,220 L 230,220 L 228,285 L 220,290 L 212,280 Z',
        center: { x: 200, y: 255 }
      },
      hip_adductors: {
        name: 'Adductors',
        path: 'M 188,225 L 212,225 L 210,260 L 205,268 L 195,268 L 190,260 Z',
        center: { x: 200, y: 245 }
      },
      tibialis_anterior: {
        name: 'Tibialis',
        path: 'M 175,295 L 182,295 L 184,340 L 180,345 L 176,342 Z M 218,295 L 225,295 L 224,342 L 220,345 L 216,340 Z',
        center: { x: 200, y: 320 }
      },
    },
    back: {
      // UPPER BACK
      trapezius_upper: {
        name: 'Upper Traps',
        path: 'M 160,100 L 200,95 L 240,100 L 245,120 L 235,125 L 200,115 L 165,125 L 155,120 Z',
        center: { x: 200, y: 110 }
      },
      trapezius_middle: {
        name: 'Mid Traps',
        path: 'M 165,128 L 235,128 L 240,145 L 230,155 L 170,155 L 160,145 Z',
        center: { x: 200, y: 140 }
      },
      trapezius_lower: {
        name: 'Lower Traps',
        path: 'M 170,158 L 230,158 L 225,175 L 200,182 L 175,175 Z',
        center: { x: 200, y: 168 }
      },

      // SHOULDERS
      posterior_deltoid: {
        name: 'Rear Delts',
        path: 'M 125,115 Q 130,105 140,110 L 148,125 Q 143,132 132,128 Z M 275,115 Q 270,105 260,110 L 252,125 Q 257,132 268,128 Z',
        center: { x: 200, y: 120 }
      },

      // MID BACK
      latissimus_dorsi: {
        name: 'Lats',
        path: 'M 150,140 Q 140,155 135,175 L 145,200 Q 155,205 170,195 L 175,165 Z M 250,140 Q 260,155 265,175 L 255,200 Q 245,205 230,195 L 225,165 Z',
        center: { x: 200, y: 170 }
      },
      rhomboids: {
        name: 'Rhomboids',
        path: 'M 180,130 L 220,130 L 225,150 L 200,155 L 175,150 Z',
        center: { x: 200, y: 142 }
      },
      erector_spinae: {
        name: 'Lower Back',
        path: 'M 185,185 L 215,185 L 218,215 L 210,225 L 190,225 L 182,215 Z',
        center: { x: 200, y: 205 }
      },

      // ARMS
      triceps_brachii: {
        name: 'Triceps',
        path: 'M 112,130 Q 108,140 105,155 L 108,170 Q 113,175 120,168 L 125,145 Z M 288,130 Q 292,140 295,155 L 292,170 Q 287,175 280,168 L 275,145 Z',
        center: { x: 200, y: 150 }
      },
      forearm_extensors: {
        name: 'Forearms',
        path: 'M 105,175 Q 102,190 100,205 L 103,220 Q 108,225 115,218 L 118,195 Z M 295,175 Q 298,190 300,205 L 297,220 Q 292,225 285,218 L 282,195 Z',
        center: { x: 200, y: 200 }
      },

      // GLUTES & LEGS
      gluteus_maximus: {
        name: 'Glutes',
        path: 'M 165,215 L 235,215 L 238,240 L 228,250 L 172,250 L 162,240 Z',
        center: { x: 200, y: 232 }
      },
      gluteus_medius: {
        name: 'Glute Medius',
        path: 'M 160,210 Q 152,218 148,230 L 155,238 Q 162,240 168,232 Z M 240,210 Q 248,218 252,230 L 245,238 Q 238,240 232,232 Z',
        center: { x: 200, y: 225 }
      },
      hamstrings: {
        name: 'Hamstrings',
        path: 'M 172,255 L 188,255 L 190,295 L 184,305 L 176,300 Z M 212,255 L 228,255 L 224,300 L 216,305 L 210,295 Z',
        center: { x: 200, y: 278 }
      },
      gastrocnemius: {
        name: 'Calves',
        path: 'M 176,308 L 185,308 L 187,335 L 183,342 L 178,338 Z M 215,308 L 224,308 L 222,338 L 218,342 L 213,335 Z',
        center: { x: 200, y: 325 }
      },
      soleus: {
        name: 'Soleus',
        path: 'M 178,340 L 184,340 L 185,355 L 181,358 L 179,353 Z M 216,340 L 222,340 L 221,353 L 219,358 L 215,355 Z',
        center: { x: 200, y: 348 }
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

  const getMuscleStyle = (muscleId) => {
    const baseStyle = {
      cursor: onMuscleClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
    }

    if (isSelected(muscleId)) {
      return {
        ...baseStyle,
        fill: '#007AFF',
        fillOpacity: 0.8,
        stroke: '#0051D5',
        strokeWidth: 2.5,
      }
    }

    if (isHighlighted(muscleId)) {
      return {
        ...baseStyle,
        fill: '#FF3B30',
        fillOpacity: 0.7,
        stroke: '#D32F2F',
        strokeWidth: 2,
      }
    }

    return {
      ...baseStyle,
      fill: '#8E8E93',
      fillOpacity: 0.3,
      stroke: '#C6C6C8',
      strokeWidth: 1.5,
    }
  }

  const currentMuscles = musclePaths[view]

  return (
    <div className="anatomical-muscle-diagram">
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

      <div className="diagram-container-anatomical">
        <svg
          viewBox="0 0 400 400"
          className="anatomical-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body outline */}
          <g className="body-outline" opacity="0.15">
            {/* Head */}
            <circle cx="200" cy="75" r="25" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>

            {/* Neck */}
            <rect x="190" y="95" width="20" height="15" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>

            {/* Torso */}
            {view === 'front' ? (
              <ellipse cx="200" cy="165" rx="65" ry="85" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>
            ) : (
              <ellipse cx="200" cy="165" rx="60" ry="85" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>
            )}

            {/* Arms */}
            <rect x="95" y="110" width="30" height="120" rx="12" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>
            <rect x="275" y="110" width="30" height="120" rx="12" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>

            {/* Legs */}
            <rect x="165" y="220" width="30" height="140" rx="12" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>
            <rect x="205" y="220" width="30" height="140" rx="12" fill="#E5E5EA" stroke="#C6C6C8" strokeWidth="2"/>
          </g>

          {/* Muscle regions */}
          {Object.entries(currentMuscles).map(([muscleId, muscle]) => (
            <g key={muscleId} className="muscle-group">
              <path
                d={muscle.path}
                style={getMuscleStyle(muscleId)}
                onClick={() => handleMuscleClick(muscleId)}
                className="muscle-region-anatomical"
              />
              {(isSelected(muscleId) || isHighlighted(muscleId)) && (
                <text
                  x={muscle.center.x}
                  y={muscle.center.y}
                  textAnchor="middle"
                  className="muscle-label-svg"
                  fontSize="10"
                  fontWeight="600"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  {muscle.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        {selectedMuscle && currentMuscles[selectedMuscle] && (
          <div className="selected-muscle-label">
            {currentMuscles[selectedMuscle].name}
          </div>
        )}
      </div>

      {highlightedMuscles.length > 0 && (
        <div className="highlighted-muscles">
          <div className="highlighted-label">Muscles Worked:</div>
          <div className="muscle-list">
            {highlightedMuscles.map(muscleId => {
              const muscle = musclePaths.front[muscleId] || musclePaths.back[muscleId]
              return muscle ? (
                <div key={muscleId} className="muscle-chip-anatomical">
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

export default AnatomicalMuscleDiagram
