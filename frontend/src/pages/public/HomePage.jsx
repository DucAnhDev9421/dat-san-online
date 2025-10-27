import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VenueCard from '../../components/VenueCard'
import { FiSearch } from 'react-icons/fi'
import { Search, MapPin, Building2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { SkeletonVenueCard } from '../../components/ui/Skeleton'
import TypeWriter from '../../components/ui/TypeWriter'

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

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
        setIsPageLoading(true)
        const response = await fetch('https://provinces.open-api.vn/api/v1/?depth=2')
        const data = await response.json()
        setProvinces(data)
        // Simulate API loading
        setTimeout(() => {
          setIsPageLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching provinces:', error)
        setIsPageLoading(false)
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
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      <section 
        className="hero"
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          minHeight: '650px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          overflow: 'hidden',
          zIndex: 0
        }}
      >
        <style>
          {`
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
        
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 1
        }} />
        
        <div style={{ 
          maxWidth: '1200px', 
          width: '100%',
          zIndex: 2,
          position: 'relative'
        }}>
          {/* Main content */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              padding: '8px 24px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ⚡ Hơn 200+ sân thể thao đang chờ bạn
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 64px)', 
              lineHeight: 1.2, 
              margin: '0 0 16px 0', 
              fontWeight: 900,
              color: '#fff',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              minHeight: '1.2em'
            }}>
              <TypeWriter 
                text="Tìm sân thể thao" 
                speed={80}
              />
            </h1>
            
            <h2 style={{ 
              fontSize: 'clamp(32px, 4vw, 56px)', 
              lineHeight: 1.2, 
              margin: '0 0 24px 0',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              minHeight: '1.2em'
            }}>
              <TypeWriter 
                text="nhanh chóng, dễ dàng" 
                speed={60}
              />
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(16px, 2vw, 20px)', 
              margin: '0 0 40px 0',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              minHeight: '1.5em'
            }}>
              <TypeWriter 
                text="Khám phá hàng trăm sân thể thao chất lượng cao với giá tốt nhất" 
                speed={30}
              />
            </p>
          </div>

          {/* Search bar integrated into hero */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '8px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '1.5em'
            }}>
              <Search size={20} style={{ flexShrink: 0 }} />
              <TypeWriter 
                text="Tìm kiếm sân phù hợp ngay" 
                speed={40}
              />
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ position: 'relative' }}>
                <Building2 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} 
                />
                <select 
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  style={{
                    padding: '16px 50px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px',
                    paddingRight: '50px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <option value="">Môn thể thao</option>
                <option value="football">Bóng đá</option>
                <option value="badminton">Cầu lông</option>
                <option value="tennis">Tennis</option>
                  <option value="pickleball">Pickleball</option>
                </select>
              </div>
              
              <div style={{ position: 'relative' }}>
                <MapPin 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }} 
                />
                  <select 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  style={{
                    padding: '16px 50px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: '#fff',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px',
                    paddingRight: '50px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <option value="">Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Building2 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: selectedProvince ? '#6b7280' : '#9ca3af',
                    pointerEvents: 'none'
                  }} 
                />
                  <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  style={{
                    padding: '16px 50px 16px 50px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: selectedProvince ? '#fff' : '#f9fafb',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px',
                    paddingRight: '50px',
                    fontWeight: 500,
                    opacity: selectedProvince ? 1 : 0.6,
                    cursor: selectedProvince ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  <option value="">Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleSearch}
                disabled={loading}
                style={{
                  padding: '16px 32px',
                  background: loading 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Tìm kiếm ngay
                  </>
                )}
              </button>
            </div>
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
          {isPageLoading ? (
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              padding: '0 16px'
            }}>
              {[...Array(4)].map((_, i) => (
                <SkeletonVenueCard key={i} />
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Recent venues */}
      <section id="recent" className="cards">
        <div className="container">
          <div className="section-head">
            <h3>Sân thể thao gần đây</h3>
            <a href="#">Xem tất cả →</a>
          </div>
          {isPageLoading ? (
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              padding: '0 16px'
            }}>
              {[...Array(8)].map((_, i) => (
                <SkeletonVenueCard key={i} />
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage

