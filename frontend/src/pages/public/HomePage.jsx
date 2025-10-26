import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VenueCard from '../../components/VenueCard'
import { FiSearch } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
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
      facilities: ['Bóng đá', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 2,
      name: 'Sân Bóng Đá Minh Khai',
      address: '456 Đường Minh Khai, Quận 3, TP.HCM',
      rating: 4.2,
      price: '180,000 VNĐ/giờ',
      operatingHours: '05:00 - 23:00',
      image: 'venue2.jpg',
      facilities: ['Bóng đá', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    },
    {
      id: 3,
      name: 'Trung Tâm Thể Thao Quận 7',
      address: '789 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
      rating: 4.7,
      price: '250,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue3.jpg',
      facilities: ['Bóng đá', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7']
    },
    {
      id: 4,
      name: 'Sân Bóng Đá Gò Vấp',
      address: '321 Đường Quang Trung, Gò Vấp, TP.HCM',
      rating: 4.0,
      price: '150,000 VNĐ/giờ',
      operatingHours: '05:30 - 22:30',
      image: 'venue4.jpg',
      facilities: ['Bóng đá', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 5,
      name: 'Sân Bóng Đá Tân Bình',
      address: '654 Đường Cộng Hòa, Tân Bình, TP.HCM',
      rating: 4.3,
      price: '220,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue5.jpg',
      facilities: ['Bóng đá', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    },
    {
      id: 6,
      name: 'Trung Tâm Thể Thao Bình Thạnh',
      address: '987 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
      rating: 4.6,
      price: '230,000 VNĐ/giờ',
      operatingHours: '05:00 - 23:00',
      image: 'venue6.jpg',
      facilities: ['Bóng đá', 'Hệ thống tưới', 'Camera', 'Bảo vệ 24/7']
    },
    {
      id: 7,
      name: 'Sân Bóng Đá Phú Nhuận',
      address: '147 Đường Phan Đình Phùng, Phú Nhuận, TP.HCM',
      rating: 4.1,
      price: '190,000 VNĐ/giờ',
      operatingHours: '06:00 - 22:00',
      image: 'venue7.jpg',
      facilities: ['Bóng đá', 'Ánh sáng', 'Thay đồ', 'Nước uống']
    },
    {
      id: 8,
      name: 'Sân Bóng Đá Thủ Đức',
      address: '258 Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
      rating: 4.4,
      price: '210,000 VNĐ/giờ',
      operatingHours: '05:30 - 22:30',
      image: 'venue8.jpg',
      facilities: ['Bóng đá', 'Bãi đỗ xe', 'Wifi', 'Quán ăn']
    }
  ]

  const handleBookVenue = (venueId) => {
    navigate(`/booking?venue=${venueId}`)
  }

  const scrollToRecent = () => {
    const element = document.getElementById('recent')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
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
        setSelectedDistrict('')
      }
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedProvince, provinces])

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const params = new URLSearchParams()
      if (selectedSport) params.append('sport', selectedSport)
      if (selectedProvince) params.append('province', selectedProvince)
      if (selectedDistrict) params.append('district', selectedDistrict)
      navigate(`/facilities?${params.toString()}`)
    }, 1000)
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
  
  const featuredVenues = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 4)
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
      <section 
        className="hero"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/all-sports-banner.webp')`,
          backgroundSize: 'cover, contain',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          color: '#fff'
        }}
      >
        <div className="container" style={{ padding: '64px 16px' }}>
          <div className="hero-content" style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '44px', lineHeight: 1.15, margin: 0, fontWeight: 800 }}>
              Đặt Sân Thể Thao Trực Tuyến
            </h1>
            <p style={{ marginTop: '12px', fontSize: '18px', opacity: 0.95 }}>
              Nhanh chóng, tiện lợi và giá tốt cho mọi môn thể thao bạn yêu thích
            </p>
            <div className="hero-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to={isAuthenticated ? '/facilities' : '/login'} className="btn btn-primary" style={{ padding: '12px 18px' }}>{isAuthenticated ? 'Khám phá ngay' : 'Bắt đầu ngay'}</Link>
              <button onClick={scrollToRecent} className="btn btn-light" style={{ padding: '12px 18px', background: '#ffffff', color: '#111827', border: 'none', cursor: 'pointer' }}>Tìm sân gần bạn</button>
            </div>
          </div>
        </div>
      </section>

      {/* Search section directly after hero */}
      <section id="search" className="search-card">
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
                <>
                  <FiSearch />
                  Tìm kiếm ngay
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Featured section below search */}
      <section className="cards" style={{ marginTop: '8px' }}>
        <div className="container">
          <div className="section-head">
            <h3>Sân thể thao nổi bật</h3>
            <a href="#">Xem tất cả →</a>
          </div>
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            padding: '0 16px'
          }}>
            {featuredVenues.map((v) => (
              <VenueCard
                key={v.id}
                image={getVenueImage(v.id)}
                name={v.name}
                address={v.address}
                rating={v.rating}
                open={v.operatingHours}
                price={v.price}
                chip={v.facilities && v.facilities[0]}
                onBook={() => handleBookVenue(v.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent venues */}
      <section id="recent" className="cards">
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
            {venues.map((v) => (
              <VenueCard
                key={v.id}
                image={getVenueImage(v.id)}
                name={v.name}
                address={v.address}
                rating={v.rating}
                open={v.operatingHours}
                price={v.price}
                chip={v.facilities && v.facilities[0]}
                onBook={() => handleBookVenue(v.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage

