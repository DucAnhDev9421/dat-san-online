import React from 'react'

export default function VenueInfo({ venueData }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          {venueData.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: '#f59e0b' }}>★★★★☆</span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>({venueData.rating}/5)</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>📍</span>
          <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.address}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>📞</span>
          <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>💰</span>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{venueData.price}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>🕐</span>
          <span style={{ fontSize: '14px', color: '#374151' }}>Giờ hoạt động: {venueData.operatingHours}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280' }}>👥</span>
          <span style={{ fontSize: '14px', color: '#374151' }}>Sức chứa: {venueData.capacity}</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
          Tiện ích
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {venueData.facilities.map((facility, index) => (
            <span key={index} style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {facility}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
          Mô tả
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
          {venueData.description}
        </p>
      </div>
    </div>
  )
}

