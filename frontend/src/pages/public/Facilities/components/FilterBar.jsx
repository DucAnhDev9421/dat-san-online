import React from 'react'
import '../../../../styles/Facilities.css'

export default function FilterBar({
  provinces,
  districts,
  selectedProvince,
  selectedDistrict,
  onProvinceChange,
  onDistrictChange,
  onClearFilters
}) {
  return (
    <div className="filter-row">
      <select 
        className="province-select"
        value={selectedProvince} 
        onChange={e => onProvinceChange(e.target.value)}
      >
        <option value="">Tất cả Tỉnh/Thành phố</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.name}>
            {province.name}
          </option>
        ))}
      </select>
      <select 
        className="district-select"
        value={selectedDistrict} 
        onChange={e => onDistrictChange(e.target.value)}
        disabled={!selectedProvince}
      >
        <option value="">Tất cả Quận/Huyện</option>
        {districts.map((district) => (
          <option key={district.code} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>
      {(selectedProvince || selectedDistrict) && (
        <button
          className="clear-filter-btn"
          onClick={onClearFilters}
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}

