import './BottomNav.css'

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'exercises', label: 'Exercises', icon: '💪' },
    { id: 'machines', label: 'Machines', icon: '🏋️' },
    { id: 'routines', label: 'Routines', icon: '📋' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍎' }
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
