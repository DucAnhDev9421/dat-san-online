import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutDashboard, Calendar, Heart, Settings } from 'lucide-react'
import ProfileHeader from './ProfileHeader'
import OverviewTab from './tabs/OverviewTab'
import BookingsTab from './tabs/BookingsTab'
import FavoritesTab from './tabs/FavoritesTab'
import SettingsTab from './tabs/SettingsTab'
import { mockUserData, mockFavoriteVenues } from './mockData'

function ProfilePage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [userData] = useState(mockUserData)
  const [favoriteVenues, setFavoriteVenues] = useState(mockFavoriteVenues)
  const [notifications, setNotifications] = useState({
    booking: true,
    promotion: true,
    email: false
  })

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'bookings', 'favorites', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  return (
    <main className="profile-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      padding: '24px 0'
    }}>
      <div className="container">
        <ProfileHeader userData={userData} favoriteVenues={favoriteVenues} />
        
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
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LayoutDashboard size={18} />
              Tổng quan
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={18} />
              Lịch sử đặt sân
            </button>
            <button 
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Heart size={18} />
              Sân yêu thích
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Settings size={18} />
              Cài đặt
            </button>
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
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'favorites' && <FavoritesTab venues={favoriteVenues} />}
          {activeTab === 'settings' && (
            <SettingsTab 
              notifications={notifications} 
              setNotifications={setNotifications} 
            />
          )}
        </section>
      </div>
    </main>
  )
}

export default ProfilePage

