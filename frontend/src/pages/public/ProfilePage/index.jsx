import React, { useMemo } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Calendar, Heart, Settings, Trophy } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { userApi } from '../../../api/userApi'
import ProfileHeader from './ProfileHeader'

function ProfilePage() {
  const { user } = useAuth()
  const location = useLocation()
  
  // Lấy số lượng sân yêu thích từ API
  const [favoriteVenuesCount, setFavoriteVenuesCount] = React.useState(0)
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

  // Merge real user data with mock data for missing fields
  const userData = useMemo(() => user ? {
    name: user.name || 'Người dùng',
    email: user.email || '',
    phone: user.phone || 'Chưa cập nhật',
    location: user.location || 'Chưa cập nhật',
    avatar: user.avatar || null,
    joinDate: user.createdAt || new Date().toISOString(),
    totalBookings: user.totalBookings || 0,
    points: user.points || 0,
    isVIP: user.isVIP || false
  } : {
    name: 'Người dùng',
    email: '',
    phone: 'Chưa cập nhật',
    location: 'Chưa cập nhật',
    avatar: null,
    joinDate: new Date().toISOString(),
    totalBookings: 0,
    points: 0,
    isVIP: false
  }, [user])

  // Get active tab from URL pathname
  const activeTab = useMemo(() => {
    const path = location.pathname
    if (path.includes('/bookings')) return 'bookings'
    if (path.includes('/favorites')) return 'favorites'
    if (path.includes('/tournaments')) return 'tournaments'
    if (path.includes('/settings')) return 'settings'
    return 'overview'
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
              to="/profile/overview"
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <LayoutDashboard size={18} />
              Tổng quan
            </Link>
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

