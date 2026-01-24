import { useState } from 'react'
import './NutritionPage.css'

const NutritionPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('log')

  const renderContent = () => {
    switch (activeSubTab) {
      case 'log':
        return (
          <div className="nutrition-content">
            <div className="empty-state">
              <div className="empty-icon">🍎</div>
              <p className="empty-text">No meals logged today</p>
              <p className="empty-hint">Log your first meal to get started</p>
            </div>
            <button className="add-btn">+ Add Meal</button>
          </div>
        )
      case 'summary':
        return (
          <div className="nutrition-content">
            <div className="summary-container">
              <h2>Daily Progress</h2>
              <div className="progress-item">
                <div className="progress-label">Calories</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="progress-value">0 / 2,500 (0%)</div>
              </div>
              <div className="progress-item">
                <div className="progress-label">Protein</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="progress-value">0g / 180g (0%)</div>
              </div>
              <div className="progress-item">
                <div className="progress-label">Carbs</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="progress-value">0g / 250g (0%)</div>
              </div>
              <div className="progress-item">
                <div className="progress-label">Fats</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="progress-value">0g / 80g (0%)</div>
              </div>
            </div>
          </div>
        )
      case 'history':
        return (
          <div className="nutrition-content">
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p className="empty-text">No history yet</p>
              <p className="empty-hint">Your past meals will appear here</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="nutrition-page">
      <div className="page-header">
        <h1>Nutrition</h1>
      </div>
      <div className="secondary-nav">
        <button
          className={`secondary-tab ${activeSubTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('log')}
        >
          Log
        </button>
        <button
          className={`secondary-tab ${activeSubTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('summary')}
        >
          Summary
        </button>
        <button
          className={`secondary-tab ${activeSubTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('history')}
        >
          History
        </button>
      </div>
      {renderContent()}
    </div>
  )
}

export default NutritionPage
