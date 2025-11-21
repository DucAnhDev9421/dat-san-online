import React from 'react'
import { Filter } from 'lucide-react'

const TournamentFilter = ({ filters, onFilterChange, tournaments }) => {
  // Get unique values for filters
  const sports = [...new Set(tournaments.map(t => t.sport))].filter(Boolean)
  const locations = [...new Set(tournaments.map(t => t.location))].filter(Boolean)
  
  const statusCounts = {
    all: tournaments.length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    ongoing: tournaments.filter(t => t.status === 'ongoing').length,
    completed: tournaments.filter(t => t.status === 'completed').length
  }

  return (
    <div className="tournament-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Filter size={18} style={{ marginRight: '8px' }} />
          Bộ lọc
        </h3>
        
        {/* Status Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Trạng thái</h4>
          <div className="filter-options">
            <label className="filter-radio">
              <input
                type="radio"
                name="status"
                value="all"
                checked={filters.status === 'all'}
                onChange={(e) => onFilterChange('status', e.target.value)}
              />
              <span>Tất cả ({statusCounts.all})</span>
            </label>
            <label className="filter-radio">
              <input
                type="radio"
                name="status"
                value="upcoming"
                checked={filters.status === 'upcoming'}
                onChange={(e) => onFilterChange('status', e.target.value)}
              />
              <span>Sắp diễn ra ({statusCounts.upcoming})</span>
            </label>
            <label className="filter-radio">
              <input
                type="radio"
                name="status"
                value="ongoing"
                checked={filters.status === 'ongoing'}
                onChange={(e) => onFilterChange('status', e.target.value)}
              />
              <span>Đang diễn ra ({statusCounts.ongoing})</span>
            </label>
            <label className="filter-radio">
              <input
                type="radio"
                name="status"
                value="completed"
                checked={filters.status === 'completed'}
                onChange={(e) => onFilterChange('status', e.target.value)}
              />
              <span>Đã kết thúc ({statusCounts.completed})</span>
            </label>
          </div>
        </div>

        {/* Sport Filter */}
        {sports.length > 0 && (
          <div className="filter-group">
            <h4 className="filter-group-title">Môn thể thao</h4>
            <div className="filter-options">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="sport"
                  value="all"
                  checked={filters.sport === 'all'}
                  onChange={(e) => onFilterChange('sport', e.target.value)}
                />
                <span>Tất cả</span>
              </label>
              {sports.map(sport => (
                <label key={sport} className="filter-radio">
                  <input
                    type="radio"
                    name="sport"
                    value={sport}
                    checked={filters.sport === sport}
                    onChange={(e) => onFilterChange('sport', e.target.value)}
                  />
                  <span>{sport}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Location Filter */}
        {locations.length > 0 && (
          <div className="filter-group">
            <h4 className="filter-group-title">Địa điểm</h4>
            <div className="filter-options">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="location"
                  value="all"
                  checked={filters.location === 'all'}
                  onChange={(e) => onFilterChange('location', e.target.value)}
                />
                <span>Tất cả</span>
              </label>
              {locations.map(location => (
                <label key={location} className="filter-radio">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    checked={filters.location === location}
                    onChange={(e) => onFilterChange('location', e.target.value)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TournamentFilter

