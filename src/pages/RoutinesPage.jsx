import SplitLayout from '../components/SplitLayout'
import MuscleDiagram from '../components/MuscleDiagram'
import './RoutinesPage.css'

const RoutinesPage = () => {
  const leftContent = (
    <div className="routines-list">
      <div className="page-header">
        <h1>Routines</h1>
      </div>
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p className="empty-text">No routines yet</p>
        <p className="empty-hint">Create your first routine to get started</p>
      </div>
      <button className="add-btn">+ Create Routine</button>
    </div>
  )

  const rightContent = (
    <MuscleDiagram />
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default RoutinesPage
