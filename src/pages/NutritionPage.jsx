import { useState, useEffect } from 'react'
import {
  getAllFoodItems,
  getAllFoodEntries,
  getFoodEntriesByDate,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem
} from '../utils/db'
import { getNutritionTargets, setNutritionTargets } from '../utils/storage'
import { generateId } from '../utils/helpers'
import './NutritionPage.css'

const NutritionPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('log')
  const [foodItems, setFoodItems] = useState([])
  const [foodEntries, setFoodEntries] = useState([])
  const [todaysEntries, setTodaysEntries] = useState([])
  const [nutritionTargets, setNutritionTargetsState] = useState(getNutritionTargets())

  // Modals
  const [showFoodLibrary, setShowFoodLibrary] = useState(false)
  const [showServingsModal, setShowServingsModal] = useState(false)
  const [showCreateFoodModal, setShowCreateFoodModal] = useState(false)
  const [showEditFoodModal, setShowEditFoodModal] = useState(false)
  const [showEditEntryModal, setShowEditEntryModal] = useState(false)
  const [showEditTargetsModal, setShowEditTargetsModal] = useState(false)
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false)

  // Selected items
  const [selectedFoodItem, setSelectedFoodItem] = useState(null)
  const [editingFoodItem, setEditingFoodItem] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null)
  const [historyDateEntries, setHistoryDateEntries] = useState([])

  // Form states
  const [servings, setServings] = useState('1')
  const [foodFormData, setFoodFormData] = useState({
    name: '',
    servingSize: '',
    servingUnits: 'g',
    caloriesPerServing: '',
    proteinPerServing: '',
    fatPerServing: '',
    carbsPerServing: ''
  })
  const [targetsFormData, setTargetsFormData] = useState(nutritionTargets)

  // Settings menu
  const [showEntrySettings, setShowEntrySettings] = useState(null)
  const [showFoodItemSettings, setShowFoodItemSettings] = useState(null)

  // Search
  const [foodSearchQuery, setFoodSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const items = await getAllFoodItems()
    const entries = await getAllFoodEntries()
    setFoodItems(items)
    setFoodEntries(entries)

    // Filter today's entries
    const today = getTodayDate()
    const todayEntries = entries.filter(e => e.date === today)
    setTodaysEntries(todayEntries)
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
  }

  // Filter food items by search query
  const getFilteredFoodItems = () => {
    if (!foodSearchQuery.trim()) {
      return foodItems
    }

    const query = foodSearchQuery.toLowerCase()
    return foodItems.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  }

  // Add food entry
  const handleOpenFoodLibrary = () => {
    setFoodSearchQuery('')
    setShowFoodLibrary(true)
  }

  const handleSelectFoodItem = (item) => {
    setSelectedFoodItem(item)
    setShowFoodLibrary(false)
    setShowServingsModal(true)
    setServings('1')
  }

  const handleConfirmServings = async () => {
    if (!selectedFoodItem || !servings || parseFloat(servings) <= 0) {
      alert('Please enter a valid number of servings')
      return
    }

    const servingsNum = parseFloat(servings)
    const entry = {
      id: generateId(),
      foodItemId: selectedFoodItem.id,
      servings: servingsNum,
      timestamp: new Date().toISOString(),
      date: getTodayDate(),
      totalCalories: Math.round(selectedFoodItem.caloriesPerServing * servingsNum),
      totalProtein: Math.round(selectedFoodItem.proteinPerServing * servingsNum * 10) / 10,
      totalFat: Math.round(selectedFoodItem.fatPerServing * servingsNum * 10) / 10,
      totalCarbs: Math.round(selectedFoodItem.carbsPerServing * servingsNum * 10) / 10
    }

    await addFoodEntry(entry)
    await loadData()
    setShowServingsModal(false)
    setSelectedFoodItem(null)
    setServings('1')
  }

  // Edit food entry
  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setServings(entry.servings.toString())
    setShowEditEntryModal(true)
    setShowEntrySettings(null)
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry || !servings || parseFloat(servings) <= 0) {
      alert('Please enter a valid number of servings')
      return
    }

    const foodItem = foodItems.find(f => f.id === editingEntry.foodItemId)
    if (!foodItem) return

    const servingsNum = parseFloat(servings)
    const updated = {
      ...editingEntry,
      servings: servingsNum,
      totalCalories: Math.round(foodItem.caloriesPerServing * servingsNum),
      totalProtein: Math.round(foodItem.proteinPerServing * servingsNum * 10) / 10,
      totalFat: Math.round(foodItem.fatPerServing * servingsNum * 10) / 10,
      totalCarbs: Math.round(foodItem.carbsPerServing * servingsNum * 10) / 10
    }

    await updateFoodEntry(updated)
    await loadData()
    setShowEditEntryModal(false)
    setEditingEntry(null)
    setServings('1')
  }

  // Delete food entry
  const handleDeleteEntry = async (entry) => {
    if (!window.confirm(`Delete this ${foodItems.find(f => f.id === entry.foodItemId)?.name} entry?`)) {
      return
    }

    await deleteFoodEntry(entry.id)
    await loadData()
    setShowEntrySettings(null)
  }

  // Create food item
  const handleOpenCreateFood = () => {
    setFoodFormData({
      name: '',
      servingSize: '',
      servingUnits: 'g',
      caloriesPerServing: '',
      proteinPerServing: '',
      fatPerServing: '',
      carbsPerServing: ''
    })
    setShowFoodLibrary(false)
    setShowCreateFoodModal(true)
  }

  const handleCreateFood = async () => {
    if (!foodFormData.name.trim() || !foodFormData.servingSize || !foodFormData.caloriesPerServing) {
      alert('Please fill in at least name, serving size, and calories')
      return
    }

    const newFoodItem = {
      id: generateId(),
      name: foodFormData.name.trim(),
      servingSize: parseFloat(foodFormData.servingSize),
      servingUnits: foodFormData.servingUnits,
      caloriesPerServing: parseFloat(foodFormData.caloriesPerServing) || 0,
      proteinPerServing: parseFloat(foodFormData.proteinPerServing) || 0,
      fatPerServing: parseFloat(foodFormData.fatPerServing) || 0,
      carbsPerServing: parseFloat(foodFormData.carbsPerServing) || 0,
      isCustom: true,
      createdAt: new Date().toISOString()
    }

    await addFoodItem(newFoodItem)
    await loadData()
    setShowCreateFoodModal(false)
  }

  // Edit food item
  const handleEditFoodItem = (item) => {
    setEditingFoodItem(item)
    setFoodFormData({
      name: item.name,
      servingSize: item.servingSize.toString(),
      servingUnits: item.servingUnits,
      caloriesPerServing: item.caloriesPerServing.toString(),
      proteinPerServing: item.proteinPerServing.toString(),
      fatPerServing: item.fatPerServing.toString(),
      carbsPerServing: item.carbsPerServing.toString()
    })
    setShowEditFoodModal(true)
    setShowFoodItemSettings(null)
  }

  const handleUpdateFoodItem = async () => {
    if (!foodFormData.name.trim() || !foodFormData.servingSize || !foodFormData.caloriesPerServing) {
      alert('Please fill in at least name, serving size, and calories')
      return
    }

    const updated = {
      ...editingFoodItem,
      name: foodFormData.name.trim(),
      servingSize: parseFloat(foodFormData.servingSize),
      servingUnits: foodFormData.servingUnits,
      caloriesPerServing: parseFloat(foodFormData.caloriesPerServing) || 0,
      proteinPerServing: parseFloat(foodFormData.proteinPerServing) || 0,
      fatPerServing: parseFloat(foodFormData.fatPerServing) || 0,
      carbsPerServing: parseFloat(foodFormData.carbsPerServing) || 0
    }

    await updateFoodItem(updated)
    await loadData()
    setShowEditFoodModal(false)
    setEditingFoodItem(null)
  }

  // Delete food item
  const handleDeleteFoodItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      return
    }

    await deleteFoodItem(item.id)
    await loadData()
    setShowFoodItemSettings(null)
  }

  // Update nutrition targets
  const handleOpenEditTargets = () => {
    setTargetsFormData(nutritionTargets)
    setShowEditTargetsModal(true)
  }

  const handleSaveTargets = () => {
    setNutritionTargets(targetsFormData)
    setNutritionTargetsState(targetsFormData)
    setShowEditTargetsModal(false)
  }

  // Calculate daily totals
  const calculateDailyTotals = (entries) => {
    return entries.reduce((totals, entry) => ({
      calories: totals.calories + entry.totalCalories,
      protein: totals.protein + entry.totalProtein,
      fat: totals.fat + entry.totalFat,
      carbs: totals.carbs + entry.totalCarbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 })
  }

  const todayTotals = calculateDailyTotals(todaysEntries)

  // Progress bar color
  const getProgressColor = (current, target) => {
    const percent = (current / target) * 100
    if (percent < 80) return 'low'
    if (percent < 95) return 'medium'
    if (percent <= 105) return 'good'
    return 'high'
  }

  // History dates (excluding today)
  const getHistoryDates = () => {
    const today = getTodayDate()
    const datesMap = {}

    foodEntries.forEach(entry => {
      if (entry.date !== today) {
        if (!datesMap[entry.date]) {
          datesMap[entry.date] = []
        }
        datesMap[entry.date].push(entry)
      }
    })

    return Object.keys(datesMap)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        entries: datesMap[date],
        totals: calculateDailyTotals(datesMap[date])
      }))
  }

  const handleSelectHistoryDate = (dateObj) => {
    setSelectedHistoryDate(dateObj.date)
    setHistoryDateEntries(dateObj.entries)
    setShowHistoryDetailModal(true)
  }

  const renderLogView = () => {
    return (
      <div className="nutrition-content">
        {todaysEntries.length > 0 ? (
          <div className="entries-list">
            {todaysEntries.map(entry => {
              const foodItem = foodItems.find(f => f.id === entry.foodItemId)
              return foodItem ? (
                <div key={entry.id} className="entry-item">
                  <div className="entry-info">
                    <div className="entry-name">{foodItem.name}</div>
                    <div className="entry-servings">
                      {entry.servings} × {foodItem.servingSize}{foodItem.servingUnits}
                    </div>
                    <div className="entry-macros">
                      {entry.totalCalories} cal • P: {entry.totalProtein}g • F: {entry.totalFat}g • C: {entry.totalCarbs}g
                    </div>
                    <div className="entry-time">{formatTime(entry.timestamp)}</div>
                  </div>
                  <button
                    className="settings-btn"
                    onClick={() => setShowEntrySettings(showEntrySettings === entry.id ? null : entry.id)}
                  >
                    •••
                  </button>
                  {showEntrySettings === entry.id && (
                    <div className="settings-menu">
                      <button onClick={() => handleEditEntry(entry)}>Edit</button>
                      <button onClick={() => handleDeleteEntry(entry)}>Delete</button>
                      <button onClick={() => setShowEntrySettings(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              ) : null
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-text">No meals logged today</p>
            <p className="empty-hint">Log your first meal to get started</p>
          </div>
        )}
        <button className="add-btn-fixed" onClick={handleOpenFoodLibrary}>
          + Add Meal
        </button>
      </div>
    )
  }

  const renderSummaryView = () => {
    const caloriesPercent = (todayTotals.calories / nutritionTargets.caloriesTarget) * 100
    const proteinPercent = (todayTotals.protein / nutritionTargets.proteinTarget) * 100
    const carbsPercent = (todayTotals.carbs / nutritionTargets.carbsTarget) * 100
    const fatsPercent = (todayTotals.fat / nutritionTargets.fatsTarget) * 100

    return (
      <div className="nutrition-content">
        <div className="summary-container">
          <h2>Daily Progress</h2>

          <div className="progress-item">
            <div className="progress-label">Calories</div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(todayTotals.calories, nutritionTargets.caloriesTarget)}`}
                style={{ width: `${Math.min(caloriesPercent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-value">
              {todayTotals.calories} / {nutritionTargets.caloriesTarget} ({Math.round(caloriesPercent)}%)
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">Protein</div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(todayTotals.protein, nutritionTargets.proteinTarget)}`}
                style={{ width: `${Math.min(proteinPercent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-value">
              {todayTotals.protein}g / {nutritionTargets.proteinTarget}g ({Math.round(proteinPercent)}%)
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">Carbs</div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(todayTotals.carbs, nutritionTargets.carbsTarget)}`}
                style={{ width: `${Math.min(carbsPercent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-value">
              {todayTotals.carbs}g / {nutritionTargets.carbsTarget}g ({Math.round(carbsPercent)}%)
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">Fats</div>
            <div className="progress-bar">
              <div
                className={`progress-fill ${getProgressColor(todayTotals.fat, nutritionTargets.fatsTarget)}`}
                style={{ width: `${Math.min(fatsPercent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-value">
              {todayTotals.fat}g / {nutritionTargets.fatsTarget}g ({Math.round(fatsPercent)}%)
            </div>
          </div>

          <div className="targets-section">
            <h3>Daily Targets</h3>
            <button className="btn-primary" onClick={handleOpenEditTargets}>
              Edit Targets
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderHistoryView = () => {
    const historyDates = getHistoryDates()

    return (
      <div className="nutrition-content">
        {historyDates.length > 0 ? (
          <div className="history-list">
            {historyDates.map(dateObj => (
              <div
                key={dateObj.date}
                className="history-item"
                onClick={() => handleSelectHistoryDate(dateObj)}
              >
                <div className="history-date">{formatDate(dateObj.date)}</div>
                <div className="history-totals">
                  Cal: {dateObj.totals.calories} | P: {dateObj.totals.protein}g | F: {dateObj.totals.fat}g | C: {dateObj.totals.carbs}g
                </div>
                <div className="chevron">›</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-text">No history yet</p>
            <p className="empty-hint">Your past meals will appear here</p>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSubTab) {
      case 'log':
        return renderLogView()
      case 'summary':
        return renderSummaryView()
      case 'history':
        return renderHistoryView()
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

      {/* Food Library Modal */}
      {showFoodLibrary && (
        <div className="modal-overlay" onClick={() => setShowFoodLibrary(false)}>
          <div className="modal-content-full" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="back-btn" onClick={() => setShowFoodLibrary(false)}>
                ← Back
              </button>
              <h2>Food Library</h2>
              <button className="add-btn-header" onClick={handleOpenCreateFood}>
                +
              </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                placeholder="Search food items..."
                className="search-input"
              />
            </div>

            <div className="food-library-list">
              {getFilteredFoodItems().length > 0 ? (
                getFilteredFoodItems().map(item => (
                  <div key={item.id} className="food-library-item">
                    <div
                      className="food-library-info"
                      onClick={() => handleSelectFoodItem(item)}
                    >
                      <div className="food-library-name">
                        {item.name}
                        {item.isCustom && <span className="custom-badge">Custom</span>}
                      </div>
                      <div className="food-library-serving">
                        {item.servingSize}{item.servingUnits} • {item.caloriesPerServing} cal
                      </div>
                      <div className="food-library-macros">
                        P: {item.proteinPerServing}g • F: {item.fatPerServing}g • C: {item.carbsPerServing}g
                      </div>
                    </div>
                    <button
                      className="settings-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFoodItemSettings(showFoodItemSettings === item.id ? null : item.id)
                      }}
                    >
                      •••
                    </button>
                    {showFoodItemSettings === item.id && (
                      <div className="settings-menu">
                        <button onClick={() => handleEditFoodItem(item)}>Edit</button>
                        <button onClick={() => handleDeleteFoodItem(item)}>Delete</button>
                        <button onClick={() => setShowFoodItemSettings(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p className="empty-text">No food items found</p>
                  <p className="empty-hint">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Servings Modal */}
      {showServingsModal && selectedFoodItem && (
        <div className="modal-overlay" onClick={() => setShowServingsModal(false)}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedFoodItem.name}</h2>
            <div className="modal-form">
              <label>How many servings?</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="number-input"
                placeholder="e.g., 1.5"
              />
              <div className="serving-info">
                1 serving = {selectedFoodItem.servingSize}{selectedFoodItem.servingUnits}
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowServingsModal(false)
                  setSelectedFoodItem(null)
                  setServings('1')
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleConfirmServings}>
                Add to Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditEntryModal && editingEntry && (
        <div className="modal-overlay" onClick={() => setShowEditEntryModal(false)}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Entry</h2>
            <div className="modal-form">
              <label>Servings</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="number-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowEditEntryModal(false)
                  setEditingEntry(null)
                  setServings('1')
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateEntry}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Food Item Modal */}
      {showCreateFoodModal && (
        <div className="modal-overlay" onClick={() => setShowCreateFoodModal(false)}>
          <div className="modal-content-food" onClick={(e) => e.stopPropagation()}>
            <h2>Create Food Item</h2>
            <div className="modal-form">
              <label>Food Name</label>
              <input
                type="text"
                value={foodFormData.name}
                onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                className="text-input"
                placeholder="e.g., Grilled Chicken"
              />

              <label>Serving Size</label>
              <div className="serving-size-row">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={foodFormData.servingSize}
                  onChange={(e) => setFoodFormData({ ...foodFormData, servingSize: e.target.value })}
                  className="number-input-inline"
                  placeholder="100"
                />
                <input
                  type="text"
                  value={foodFormData.servingUnits}
                  onChange={(e) => setFoodFormData({ ...foodFormData, servingUnits: e.target.value })}
                  className="text-input-inline"
                  placeholder="g"
                />
              </div>

              <label>Calories per Serving</label>
              <input
                type="number"
                min="0"
                value={foodFormData.caloriesPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, caloriesPerServing: e.target.value })}
                className="number-input"
                placeholder="0"
              />

              <label>Protein (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.proteinPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, proteinPerServing: e.target.value })}
                className="number-input"
                placeholder="0"
              />

              <label>Fat (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.fatPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, fatPerServing: e.target.value })}
                className="number-input"
                placeholder="0"
              />

              <label>Carbs (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.carbsPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, carbsPerServing: e.target.value })}
                className="number-input"
                placeholder="0"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowCreateFoodModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateFood}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Food Item Modal */}
      {showEditFoodModal && editingFoodItem && (
        <div className="modal-overlay" onClick={() => setShowEditFoodModal(false)}>
          <div className="modal-content-food" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Food Item</h2>
            <div className="modal-form">
              <label>Food Name</label>
              <input
                type="text"
                value={foodFormData.name}
                onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                className="text-input"
              />

              <label>Serving Size</label>
              <div className="serving-size-row">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={foodFormData.servingSize}
                  onChange={(e) => setFoodFormData({ ...foodFormData, servingSize: e.target.value })}
                  className="number-input-inline"
                />
                <input
                  type="text"
                  value={foodFormData.servingUnits}
                  onChange={(e) => setFoodFormData({ ...foodFormData, servingUnits: e.target.value })}
                  className="text-input-inline"
                />
              </div>

              <label>Calories per Serving</label>
              <input
                type="number"
                min="0"
                value={foodFormData.caloriesPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, caloriesPerServing: e.target.value })}
                className="number-input"
              />

              <label>Protein (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.proteinPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, proteinPerServing: e.target.value })}
                className="number-input"
              />

              <label>Fat (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.fatPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, fatPerServing: e.target.value })}
                className="number-input"
              />

              <label>Carbs (g) per Serving</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={foodFormData.carbsPerServing}
                onChange={(e) => setFoodFormData({ ...foodFormData, carbsPerServing: e.target.value })}
                className="number-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowEditFoodModal(false)
                  setEditingFoodItem(null)
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateFoodItem}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Targets Modal */}
      {showEditTargetsModal && (
        <div className="modal-overlay" onClick={() => setShowEditTargetsModal(false)}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Daily Targets</h2>
            <div className="modal-form">
              <label>Calories Target</label>
              <input
                type="number"
                min="0"
                value={targetsFormData.caloriesTarget}
                onChange={(e) => setTargetsFormData({ ...targetsFormData, caloriesTarget: parseInt(e.target.value) || 0 })}
                className="number-input"
              />

              <label>Protein (g) Target</label>
              <input
                type="number"
                min="0"
                value={targetsFormData.proteinTarget}
                onChange={(e) => setTargetsFormData({ ...targetsFormData, proteinTarget: parseInt(e.target.value) || 0 })}
                className="number-input"
              />

              <label>Carbs (g) Target</label>
              <input
                type="number"
                min="0"
                value={targetsFormData.carbsTarget}
                onChange={(e) => setTargetsFormData({ ...targetsFormData, carbsTarget: parseInt(e.target.value) || 0 })}
                className="number-input"
              />

              <label>Fats (g) Target</label>
              <input
                type="number"
                min="0"
                value={targetsFormData.fatsTarget}
                onChange={(e) => setTargetsFormData({ ...targetsFormData, fatsTarget: parseInt(e.target.value) || 0 })}
                className="number-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowEditTargetsModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveTargets}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Detail Modal */}
      {showHistoryDetailModal && selectedHistoryDate && (
        <div className="modal-overlay" onClick={() => setShowHistoryDetailModal(false)}>
          <div className="modal-content-full" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="back-btn" onClick={() => setShowHistoryDetailModal(false)}>
                ← Back
              </button>
              <h2>{formatDate(selectedHistoryDate)}</h2>
            </div>

            <div className="entries-list">
              {historyDateEntries.map(entry => {
                const foodItem = foodItems.find(f => f.id === entry.foodItemId)
                return foodItem ? (
                  <div key={entry.id} className="entry-item">
                    <div className="entry-info">
                      <div className="entry-name">{foodItem.name}</div>
                      <div className="entry-servings">
                        {entry.servings} × {foodItem.servingSize}{foodItem.servingUnits}
                      </div>
                      <div className="entry-macros">
                        {entry.totalCalories} cal • P: {entry.totalProtein}g • F: {entry.totalFat}g • C: {entry.totalCarbs}g
                      </div>
                      <div className="entry-time">{formatTime(entry.timestamp)}</div>
                    </div>
                    <button
                      className="settings-btn"
                      onClick={() => setShowEntrySettings(showEntrySettings === entry.id ? null : entry.id)}
                    >
                      •••
                    </button>
                    {showEntrySettings === entry.id && (
                      <div className="settings-menu">
                        <button onClick={() => handleEditEntry(entry)}>Edit</button>
                        <button onClick={() => handleDeleteEntry(entry)}>Delete</button>
                        <button onClick={() => setShowEntrySettings(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NutritionPage
