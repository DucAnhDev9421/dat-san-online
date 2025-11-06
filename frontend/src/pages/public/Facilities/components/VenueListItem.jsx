import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonVenueCardList } from '../../../../components/ui/Skeleton'
import '../../../../styles/Facilities.css'

export default function VenueListItem({ facilities, loading, onBookVenue }) {
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
              
              <div className="venue-list-info">
                📍 {f.district}, {f.city}
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

