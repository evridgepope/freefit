import './BottomNav.css'

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'exercises', label: 'Exercises' },
    { id: 'machines', label: 'Machines' },
    { id: 'routines', label: 'Routines' },
    { id: 'nutrition', label: 'Nutrition' }
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
