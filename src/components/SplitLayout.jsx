import './SplitLayout.css'

const SplitLayout = ({ leftContent, rightContent }) => {
  return (
    <div className="split-layout">
      <div className="split-left">
        {leftContent}
      </div>
      <div className="split-right">
        {rightContent}
      </div>
    </div>
  )
}

export default SplitLayout
