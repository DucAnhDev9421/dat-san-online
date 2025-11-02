import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import '../../../../styles/HomePage.css'

const locations = [
  {
    id: 1,
    name: 'Hồ Chí Minh',
    district: 'TP.HCM',
    venuesCount: 85,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: 'Hà Nội',
    district: 'Thủ đô',
    venuesCount: 72,
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: 'Đà Nẵng',
    district: 'Miền Trung',
    venuesCount: 45,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: 'Cần Thơ',
    district: 'Đồng bằng sông Cửu Long',
    venuesCount: 38,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 5,
    name: 'Nha Trang',
    district: 'Khánh Hòa',
    venuesCount: 28,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 6,
    name: 'Hải Phòng',
    district: 'Miền Bắc',
    venuesCount: 32,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
]

export default function PopularLocationsSection() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleLocationClick = (location) => {
    navigate(`/facilities?province=${location.name}`)
  }

  return (
    <section ref={sectionRef} className="popular-locations-section">
      <div className="locations-container">
        <div className="locations-header">
          <div className="locations-badge">
            <MapPin size={16} />
            Địa điểm phổ biến
          </div>
          <h2 className="locations-title">
            Khám phá sân thể thao tại các thành phố
          </h2>
          <p className="locations-subtitle">
            Tìm kiếm và đặt sân tại những địa điểm được yêu thích nhất
          </p>
        </div>

        <div className={`locations-grid ${isVisible ? 'visible' : ''}`}>
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="location-card"
              onClick={() => handleLocationClick(location)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="location-image-wrapper">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="location-image"
                />
                <div 
                  className="location-overlay"
                  style={{
                    background: location.gradient
                  }}
                />
              </div>
              
              <div className="location-content">
                <div className="location-info">
                  <h3 className="location-name">{location.name}</h3>
                  <p className="location-district">{location.district}</p>
                </div>
                <div className="location-stats">
                  <span className="location-venues-count">
                    {location.venuesCount}+ sân
                  </span>
                  <ArrowRight size={18} className="location-arrow" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

