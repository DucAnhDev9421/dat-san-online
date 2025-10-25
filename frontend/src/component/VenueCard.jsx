import React from 'react'
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'

export default function VenueCard({
  image,
  name,
  address,
  rating,
  open,
  price,
  sport,
  status = 'Còn trống',
  onBook,
  chip,
}) {
  return (
    <div 
      className="venue-card"
      style={{
        background: '#fff',
        border: '1px solid #eef2f7',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(16,24,40,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <div className="venue-card-image" style={{ position: 'relative', width: '100%', height: 200, background: '#f3f4f6' }}>
        {image ? (
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
        <span style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: '#111827',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <AiFillStar /> {rating}
        </span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(chip || sport) && (
            <span style={{ fontSize: 12, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 999 }}>{chip || sport}</span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: 999 }}>{status}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{name}</div>
        {address && (
          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiMapPin /> {address}
          </div>
        )}
        {open && (
          <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiClock /> {open}
          </div>
        )}
        {price && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiDollarSign /> {price}
            </span>
            {onBook && (
              <button 
                className="venue-card-button"
                onClick={onBook} 
                style={{ marginLeft: 'auto', background: '#111827', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}
              >
                Đặt sân ngay
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
