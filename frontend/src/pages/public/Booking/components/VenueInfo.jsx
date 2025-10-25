import React from 'react'
import { Star, MapPin, Phone, Clock, Users, Wifi, Car, Coffee, Shield } from 'lucide-react'

export default function VenueInfo({ venueData }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
          {venueData.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            {venueData.rating} ({venueData.reviewCount} đánh giá)
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.address}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>{venueData.phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#6b7280', fontSize: '16px' }}>💰</span>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>{venueData.price}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>Giờ hoạt động: {venueData.operatingHours}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>Sức chứa: {venueData.capacity}</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
          Tiện ích
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {venueData.facilities.map((facility, index) => {
            const getIcon = (facility) => {
              if (facility.includes('WiFi') || facility.includes('Internet')) return <Wifi size={12} />
              if (facility.includes('Parking') || facility.includes('Bãi đỗ')) return <Car size={12} />
              if (facility.includes('Cafe') || facility.includes('Đồ uống')) return <Coffee size={12} />
              if (facility.includes('Bảo vệ') || facility.includes('An ninh')) return <Shield size={12} />
              return null
            }
            
            return (
              <span key={index} style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {getIcon(facility)}
                {facility}
              </span>
            )
          })}
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

