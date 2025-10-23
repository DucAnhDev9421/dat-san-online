import React, { useState } from 'react'
import { LayoutDashboard, Calendar, Heart, Settings } from 'lucide-react'
import ProfileHeader from './ProfileHeader'
import OverviewTab from './tabs/OverviewTab'
import BookingsTab from './tabs/BookingsTab'
import FavoritesTab from './tabs/FavoritesTab'
import SettingsTab from './tabs/SettingsTab'
import { mockUserData, mockFavoriteVenues } from './mockData'

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userData] = useState(mockUserData)
  const [favoriteVenues, setFavoriteVenues] = useState(mockFavoriteVenues)
  const [notifications, setNotifications] = useState({
    booking: true,
    promotion: true,
    email: false
  })

  return (
    <main className="profile-page">
      <div className="container">
        <ProfileHeader userData={userData} favoriteVenues={favoriteVenues} />
        
        {/* Navigation Tabs */}
        <section className="profile-tabs">
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
        <section className="profile-content">
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

