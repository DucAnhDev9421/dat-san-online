import React, { useMemo } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Calendar, Heart, Settings, Trophy } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { userApi } from '../../../api/userApi'
import { bookingApi } from '../../../api/bookingApi'
import ProfileHeader from './ProfileHeader'

function ProfilePage() {
  const { user } = useAuth()
  const location = useLocation()
  
  // Lấy số lượng sân yêu thích từ API
  const [favoriteVenuesCount, setFavoriteVenuesCount] = React.useState(0)
  const [totalBookingsCount, setTotalBookingsCount] = React.useState(0)
  const { isAuthenticated } = useAuth()

  // Fetch favorites count
  React.useEffect(() => {
    const fetchFavoritesCount = async () => {
      if (!isAuthenticated) {
        setFavoriteVenuesCount(0)
        return
      }

      try {
        const result = await userApi.getFavorites()
        if (result.success && result.data) {
          setFavoriteVenuesCount(result.data.count || 0)
        }
      } catch (error) {
        console.error('Error fetching favorites count:', error)
        setFavoriteVenuesCount(0)
      }
    }

    fetchFavoritesCount()

    // Listen for favorites updates
    const handleFavoritesUpdated = () => {
      fetchFavoritesCount()
    }

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated)

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated)
    }
  }, [isAuthenticated])

  // Fetch total bookings count
  React.useEffect(() => {
    const fetchBookingsCount = async () => {
      if (!isAuthenticated) {
        setTotalBookingsCount(0)
        return
      }

      try {
        // Fetch với limit=1 để chỉ lấy pagination info
        const result = await bookingApi.getMyBookings({ page: 1, limit: 1 })
        
        // Kiểm tra nhiều cấu trúc response có thể có
        let total = 0
        
        // Kiểm tra result có tồn tại không
        if (!result) {
          setTotalBookingsCount(0)
          return
        }
        
        // Kiểm tra result.data
        if (result.data) {
          // Cấu trúc 1: result.data.pagination.total (chuẩn từ backend)
          if (result.data.pagination && typeof result.data.pagination.total === 'number') {
            total = result.data.pagination.total
          }
          // Cấu trúc 2: result.data.bookings là array và có pagination
          else if (result.data.bookings && result.data.pagination) {
            total = result.data.pagination.total || 0
          }
          // Cấu trúc 3: result.data.total (nếu API trả về trực tiếp)
          else if (typeof result.data.total === 'number') {
            total = result.data.total
          }
          // Cấu trúc 4: result.data là array (fallback)
          else if (Array.isArray(result.data)) {
            total = result.data.length
          }
          // Thử tìm pagination ở các level khác
          else if (result.pagination && typeof result.pagination.total === 'number') {
            total = result.pagination.total
          }
        } else if (result.pagination && typeof result.pagination.total === 'number') {
          // Thử kiểm tra result trực tiếp
          total = result.pagination.total
        }
        
        setTotalBookingsCount(total)
      } catch (error) {
        console.error('Error fetching bookings count:', error)
        setTotalBookingsCount(0)
      }
    }

    fetchBookingsCount()
  }, [isAuthenticated])

  // Merge real user data with mock data for missing fields
  const userData = useMemo(() => user ? {
    name: user.name || 'Người dùng',
    email: user.email || '',
    phone: user.phone || 'Chưa cập nhật',
    location: user.location || 'Chưa cập nhật',
    avatar: user.avatar || null,
    joinDate: user.createdAt || new Date().toISOString(),
    totalBookings: totalBookingsCount, // Sử dụng số lượng thực tế từ API
    points: user.loyaltyPoints || user.points || 0, // Ưu tiên loyaltyPoints, fallback về points
    isVIP: user.isVIP || false
  } : {
    name: 'Người dùng',
    email: '',
    phone: 'Chưa cập nhật',
    location: 'Chưa cập nhật',
    avatar: null,
    joinDate: new Date().toISOString(),
    totalBookings: totalBookingsCount,
    points: 0,
    isVIP: false
  }, [user, totalBookingsCount])

  // Get active tab from URL pathname
  const activeTab = useMemo(() => {
    const path = location.pathname
    if (path.includes('/bookings')) return 'bookings'
    if (path.includes('/favorites')) return 'favorites'
    if (path.includes('/tournaments')) return 'tournaments'
    if (path.includes('/settings')) return 'settings'
    return 'bookings' // Default to bookings instead of overview
  }, [location.pathname])

  return (
    <main className="profile-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      padding: '24px 0'
    }}>
      <div className="container">
        <ProfileHeader userData={userData} favoriteVenuesCount={favoriteVenuesCount} />
        
        {/* Navigation Tabs */}
        <section className="profile-tabs" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div className="tabs">
            <Link 
              to="/profile/bookings"
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <Calendar size={18} />
              Đặt sân của tôi
            </Link>
            <Link 
              to="/profile/favorites"
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <Heart size={18} />
              Sân yêu thích
            </Link>
            <Link 
              to="/profile/tournaments"
              className={`tab ${activeTab === 'tournaments' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <Trophy size={18} />
              Giải đấu của tôi
            </Link>
            <Link 
              to="/profile/settings"
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <Settings size={18} />
              Cài đặt
            </Link>
          </div>
        </section>

        {/* Tab Content */}
        <section className="profile-content" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default ProfilePage

