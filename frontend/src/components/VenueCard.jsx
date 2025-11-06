import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  venueId,
}) {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * 10
    const rotateY = ((centerX - x) / centerX) * 10
    
    setMousePosition({ x: rotateY, y: rotateX })
  }

  const handleMouseLeave = (e) => {
    setMousePosition({ x: 0, y: 0 })
    // Reset border and shadow
    if (e.currentTarget) {
      e.currentTarget.style.borderColor = '#cbd5e1'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,24,40,0.08), 0 0 0 1px rgba(0,0,0,0.05)'
    }
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = '#667eea'
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15), 0 0 0 2px rgba(102, 126, 234, 0.1)'
  }

  const handleCardClick = (e) => {
    // Don't navigate if clicking the button
    if (e.target.closest('.venue-card-button')) {
      return
    }
    
    if (venueId) {
      navigate(`/booking?venue=${venueId}`)
    } else if (onBook) {
      onBook()
    }
  }

  return (
    <div 
      ref={cardRef}
      className="venue-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        background: '#fff',
        border: '2px solid #cbd5e1',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(16,24,40,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.05s ease-out, border-color 0.3s ease',
        transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      <div className="venue-card-image" style={{ 
        position: 'relative', 
        width: '100%', 
        height: 200, 
        background: '#f3f4f6',
        transform: 'translateZ(20px)',
        transition: 'all 0.3s ease'
      }}>
        {image ? (
          <img 
            src={image} 
            alt={name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }} 
          />
        ) : null}
        {rating > 0 && (
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
            <AiFillStar /> {typeof rating === 'number' ? rating.toFixed(1) : rating}
          </span>
        )}
      </div>
      <div style={{ 
        padding: 16, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8,
        transform: 'translateZ(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(chip || sport) && (
            <span style={{ 
              fontSize: 12, 
              color: '#16a34a', 
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
              padding: '4px 10px', 
              borderRadius: 999,
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.1)'
            }}>
              {chip || sport}
            </span>
          )}
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: 12, 
            color: '#10b981', 
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', 
            padding: '4px 10px', 
            borderRadius: 999,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
          }}>
            {status}
          </span>
        </div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 800, 
          color: '#0f172a',
          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {name}
        </div>
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
                style={{ 
                  marginLeft: 'auto', 
                  background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', 
                  color: '#fff', 
                  fontWeight: 700, 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '10px 16px', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(17, 24, 39, 0.2)',
                  transform: 'translateZ(5px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateZ(5px) translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(17, 24, 39, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateZ(5px)'
                  e.target.style.boxShadow = '0 4px 8px rgba(17, 24, 39, 0.2)'
                }}
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
