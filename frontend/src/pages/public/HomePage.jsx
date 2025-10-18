import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for venues
  const venues = [
    {
      id: 1,
      name: 'Truong Football',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      rating: 4.5,
      price: '200,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue1.jpg',
      facilities: ['Cỏ nhân tạo', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 2,
      name: 'Sân Bóng Đá Minh Khai',
      address: '456 Đường Minh Khai, Quận 3, TP.HCM',
      rating: 4.2,
      price: '180,000 VNĐ/giờ',
      operatingHours: '05:00 - 23:00',
      image: 'venue2.jpg',
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    },
    {
      id: 3,
      name: 'Trung Tâm Thể Thao Quận 7',
      address: '789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
      rating: 4.7,
      price: '250,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue3.jpg',
      facilities: ['Cỏ nhân tạo', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7']
    },
    {
      id: 4,
      name: 'Sân Bóng Đá Gò Vấp',
      address: '321 Đường Quang Trung, Gò Vấp, TP.HCM',
      rating: 4.0,
      price: '150,000 VNĐ/giờ',
      operatingHours: '05:30 - 22:30',
      image: 'venue4.jpg',
      facilities: ['Cỏ nhân tạo', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 5,
      name: 'Sân Bóng Đá Tân Bình',
      address: '654 Đường Cộng Hòa, Tân Bình, TP.HCM',
      rating: 4.3,
      price: '220,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue5.jpg',
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    },
    {
      id: 6,
      name: 'Trung Tâm Thể Thao Bình Thạnh',
      address: '987 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
      rating: 4.6,
      price: '230,000 VNĐ/giờ',
      operatingHours: '05:00 - 23:00',
      image: 'venue6.jpg',
      facilities: ['Cỏ nhân tạo', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7']
    },
    {
      id: 7,
      name: 'Sân Bóng Đá Phú Nhuận',
      address: '147 Đường Phan Đình Phùng, Phú Nhuận, TP.HCM',
      rating: 4.1,
      price: '190,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue7.jpg',
      facilities: ['Cỏ nhân tạo', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 8,
      name: 'Sân Bóng Đá Thủ Đức',
      address: '258 Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
      rating: 4.4,
      price: '210,000 VNĐ/giờ',
      operatingHours: '05:30 - 22:30',
      image: 'venue8.jpg',
      facilities: ['Cỏ tự nhiên', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    }
  ]

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  // Fetch provinces data from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/v1/?depth=2')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }
    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince)
      if (province && province.districts) {
        setDistricts(province.districts)
        setSelectedDistrict('') // Reset district when province changes
      }
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedProvince, provinces])

  const handleSearch = () => {
    setLoading(true)
    // Simulate search delay
    setTimeout(() => {
      setLoading(false)
      // Navigate to facilities page with search params
      const params = new URLSearchParams()
      if (selectedSport) params.append('sport', selectedSport)
      if (selectedProvince) params.append('province', selectedProvince)
      if (selectedDistrict) params.append('district', selectedDistrict)
      navigate(`/facilities?${params.toString()}`)
    }, 1000)
  }

  // Helper functions for venue styling
  const getVenueGradient = (venueId) => {
    const gradients = [
      'rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)', // Purple-Blue
      'rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8)',   // Green
      'rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8)',    // Red
      'rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)',   // Blue
      'rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.8)',  // Purple
      'rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.8)',   // Orange
      'rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.8)',  // Pink
      'rgba(14, 165, 233, 0.8), rgba(2, 132, 199, 0.8)'    // Sky Blue
    ]
    return gradients[(venueId - 1) % gradients.length]
  }

  const getVenueImage = (venueId) => {
    const images = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop&crop=center'
    ]
    return images[(venueId - 1) % images.length]
  }
  return (
    <main>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Booking sport</h1>
            <p>Đặt sân thể thao dễ dàng, nhanh chóng</p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">Đăng nhập / Đăng ký</Link>
              <button className="btn btn-light">Tải ứng dụng</button>
            </div>
          </div>
        </div>
      </section>

      <section className="search-card">
        <div className="container">
          <h3>Đặt sân thể thao ngay</h3>
          <div className="search-row">
            <select 
              className="input"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              style={{
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}
            >
              <option value="">Chọn môn thể thao</option>
              <option value="football">Bóng đá</option>
              <option value="badminton">Cầu lông</option>
              <option value="tennis">Tennis</option>
              <option value="pickleball">Pickleball</option>
            </select>
            <select 
              className="input"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              style={{
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}
            >
              <option value="">Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
            <select 
              className="input"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
              style={{
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
                paddingRight: '40px',
                opacity: selectedProvince ? 1 : 0.6,
                cursor: selectedProvince ? 'pointer' : 'not-allowed'
              }}
            >
              <option value="">Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary" 
              onClick={handleSearch}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Đang tìm...
                </>
              ) : (
                'Tìm kiếm ngay'
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="container">
          <div className="section-head">
            <h3>Sân thể thao gần đây</h3>
            <a href="#">Xem tất cả →</a>
          </div>
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            padding: '0 16px'
          }}>
            {venues.map((venue) => (
              <article key={venue.id} className="card" style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}>
                <div className="card-thumb">
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: `linear-gradient(135deg, ${getVenueGradient(venue.id)}), url(${getVenueImage(venue.id)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {venue.rating} ⭐
                    </div>
                    {venue.name}
                  </div>
                </div>
                <div className="card-body" style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: '280px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0 0 8px 0',
                    lineHeight: '1.3',
                    height: '42px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {venue.name}
                  </h4>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                    height: '36px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    📍 {venue.address}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    height: '20px'
                  }}>
                    <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                      {'★'.repeat(Math.floor(venue.rating))}{'☆'.repeat(5 - Math.floor(venue.rating))}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>({venue.rating})</span>
                  </div>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '0 0 8px 0',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    🕐 {venue.operatingHours}
                  </p>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#059669',
                    fontWeight: '700',
                    margin: '0 0 12px 0',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    💰 {venue.price}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '16px',
                    minHeight: '32px',
                    flex: '1'
                  }}>
                    {venue.facilities.slice(0, 2).map((facility, index) => (
                      <span key={index} style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        border: '1px solid #d1fae5'
                      }}>
                        {facility}
                      </span>
                    ))}
                    {venue.facilities.length > 2 && (
                      <span style={{
                        background: '#f3f4f6',
                        color: '#6b7280',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        +{venue.facilities.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-outline small"
                    onClick={() => handleBookVenue(venue.id)}
                    style={{
                      width: '100%',
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginTop: 'auto',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#3b82f6'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    Đặt lịch
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage

