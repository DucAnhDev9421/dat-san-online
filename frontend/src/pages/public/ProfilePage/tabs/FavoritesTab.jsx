import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Heart } from 'lucide-react'

export default function FavoritesTab({ venues }) {
  return (
    <div className="favorites-section">
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>Sân yêu thích</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Những sân bạn thường xuyên đặt</p>
      </div>
      
      <div className="favorites-list" style={{ marginTop: '24px' }}>
        {venues.length > 0 ? (
          venues.map(venue => (
            <div key={venue.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ flex: 1 }}>
                <Link 
                  to={`/booking?venue=${venue.id}`}
                  style={{ 
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.color = 'inherit'}
                  >
                    {venue.name}
                  </h4>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ 
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {venue.sport}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <MapPin size={16} strokeWidth={2} /> {venue.address}
                </p>
              </div>
              <div style={{ 
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Đã đặt</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb' }}>
                  {venue.bookingCount} lần
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Heart size={48} strokeWidth={1.5} color="#d1d5db" />
            </div>
            <h4 style={{ marginBottom: '8px' }}>Chưa có sân yêu thích</h4>
            <p style={{ marginBottom: '16px' }}>Thêm các sân bạn thích vào danh sách để dễ dàng đặt sân sau này</p>
            <Link to="/facilities" className="btn btn-primary">
              Khám phá các sân
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

