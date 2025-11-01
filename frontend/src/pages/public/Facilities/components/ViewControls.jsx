import React from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import '../../../../styles/Facilities.css'

export default function ViewControls({ quick, view, onQuickChange, onViewChange }) {
  const QuickButton = ({ value, label }) => (
    <button
      onClick={() => onQuickChange(value)}
      className={`quick-filter-button ${quick === value ? 'active' : ''}`}
    >
      {label}
    </button>
  )

  return (
    <div className="view-toggle-row">
      <div className="quick-buttons-wrapper">
        <div className="quick-buttons-group">
          <QuickButton value="recent" label="Gần đây" />
          <QuickButton value="cheap" label="Giá tốt" />
          <QuickButton value="top" label="Đánh giá cao" />
        </div>
        <div className="view-toggle-group">
          <button 
            onClick={() => onViewChange("grid")}
            className={`view-toggle-btn ${view === "grid" ? 'active' : ''}`}
          >
            <FiGrid />
          </button>
          <button 
            onClick={() => onViewChange("list")}
            className={`view-toggle-btn ${view === "list" ? 'active' : ''}`}
          >
            <FiList />
          </button>
        </div>
      </div>
    </div>
  )
}

