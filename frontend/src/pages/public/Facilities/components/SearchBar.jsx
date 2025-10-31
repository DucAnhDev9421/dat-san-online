import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { sportChips } from '../mockData'
import '../../../../styles/Facilities.css'

export default function SearchBar({ query, sport, onQueryChange, onSportChange }) {
  return (
    <div className="search-bar-row">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Tìm kiếm theo tên sân..."
          className="search-input"
        />
      </div>
      <select 
        className="sport-select" 
        value={sport} 
        onChange={e => onSportChange(e.target.value)}
      >
        {sportChips.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}

