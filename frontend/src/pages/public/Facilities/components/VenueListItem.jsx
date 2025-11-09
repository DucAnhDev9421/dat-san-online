import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonVenueCardList } from '../../../../components/ui/Skeleton'
import { calculateDistance, formatDistance } from '../../../../utils/distance'
import { FiNavigation } from 'react-icons/fi'
import '../../../../styles/Facilities.css'

export default function VenueListItem({ facilities, loading, onBookVenue, userLocation }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="venue-list-container">
        {[...Array(6)].map((_, i) => (
          <SkeletonVenueCardList key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="venue-list-container">
      {facilities.map(f => (
        <div 
          key={f.id} 
          className="venue-list-item"
          onClick={() => navigate(`/booking?venue=${f.id}`)}
        >
          <div className="venue-list-image">
            <img src={f.image} alt={f.name} />
            <span className="venue-rating-badge">
              ★ {f.rating}
            </span>
          </div>
          
          <div className="venue-list-content">
            <div className="venue-list-main">
              <div className="venue-tags">
                <span className="venue-tag venue-tag-sport">
                  {f.sport}
                </span>
                <span className="venue-tag venue-tag-status">
                  {f.status}
                </span>
              </div>
              
              <h3 className="venue-list-title">
                {f.name}
              </h3>
              
              <div className="venue-list-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>📍 {f.district}, {f.city}</span>
                {(() => {
                  if (!userLocation || !f.location) return null
                  
                  let lat2, lon2
                  if (f.location.coordinates && Array.isArray(f.location.coordinates)) {
                    [lon2, lat2] = f.location.coordinates
                  } else if (f.location.latitude && f.location.longitude) {
                    lat2 = f.location.latitude
                    lon2 = f.location.longitude
                  } else {
                    return null
                  }
                  
                  const dist = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    lat2,
                    lon2
                  )
                  
                  const formattedDist = formatDistance(dist)
                  if (!formattedDist) return null
                  
                  return (
                    <span style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: '#667eea',
                      fontWeight: 600
                    }}>
                      <FiNavigation size={12} />
                      {formattedDist}
                    </span>
                  )
                })()}
              </div>
              
              <div className="venue-list-info">
                🕒 {f.open}
              </div>
            </div>
            
            <div className="venue-list-bottom">
              <div className="venue-list-price">
                💰 {typeof f.price === 'number' ? `${f.price.toLocaleString()} VND/giờ` : f.price || '0 VND/giờ'}
              </div>
              <button 
                className="venue-list-book-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onBookVenue) {
                    onBookVenue(f.id)
                  } else {
                    navigate(`/booking?venue=${f.id}`)
                  }
                }}
              >
                Đặt sân ngay
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

